using LambdaPulse.Engine.Features.Logging;
using Npgsql;
using NpgsqlTypes;
using System.Globalization;
using System.Text.Json;

namespace LambdaPulse.Server.Services.Telemetry;

internal sealed class PostgresTelemetryRepository : ITelemetryRepository
{
    private readonly string _connectionString;

    public PostgresTelemetryRepository(PostgresConfig config)
    {
        _connectionString = config.ConnectionString;
    }

    public async Task InsertTrace(Trace trace, CancellationToken cancellationToken = default)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        //wrap in a transaction (one trace -> many steps)
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);

        try
        {
            var insertTraceSql = @"INSERT INTO telemetry.traces (timestamp_start, duration_ms, req_method, req_path, req_protocol, res_status_code, res_phrase)
                                   VALUES (@TimestampStart, @DurationMs, @ReqMethod, @ReqPath, @ReqProtocol, @ResStatusCode, @ResPhrase) 
                                   RETURNING id;";

            await using var traceCommand = new NpgsqlCommand(insertTraceSql, connection, transaction);

            traceCommand.Parameters.Add(new NpgsqlParameter("TimestampStart", NpgsqlDbType.TimestampTz) { Value = trace.TimestampStart });
            traceCommand.Parameters.Add(new NpgsqlParameter("DurationMs", NpgsqlDbType.Bigint) { Value = trace.DurationMs });
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqMethod", NpgsqlDbType.Varchar) { Value = (object?)trace.RequestMethod ?? DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqPath", NpgsqlDbType.Text) { Value = (object?)trace.RequestPath ?? DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqProtocol", NpgsqlDbType.Varchar) { Value = (object?)trace.RequestProtocol ?? DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ResStatusCode", NpgsqlDbType.Integer) { Value = (object?)trace.ResponseStatusCode ?? DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ResPhrase", NpgsqlDbType.Text) { Value = (object?)trace.ResponsePhrase ?? DBNull.Value });

            var rawTraceId = await traceCommand.ExecuteScalarAsync(cancellationToken);
            var traceId = Convert.ToInt64(rawTraceId, CultureInfo.InvariantCulture);

            var insertStepSql = @"INSERT INTO telemetry.steps (trace_id, middleware, direction, event, timestamp_start, duration_ms, logs)
                                   VALUES (@TraceId, @Middleware, CAST(@Direction AS telemetry.flow_direction), CAST(@Event AS telemetry.execution_event), @TimestampStart, @DurationMs, @Logs);";

            foreach (var step in trace.Steps)
            {
                await using var stepCommand = new NpgsqlCommand(insertStepSql, connection, transaction);
                stepCommand.Parameters.Add(new NpgsqlParameter("TraceId", NpgsqlDbType.Bigint) { Value = traceId });
                stepCommand.Parameters.Add(new NpgsqlParameter("Middleware", NpgsqlDbType.Varchar) { Value = step.Middleware });
                stepCommand.Parameters.Add(new NpgsqlParameter("Direction", NpgsqlDbType.Text) { Value = step.Direction.HasValue ? MapFlowDirection(step.Direction.Value) : DBNull.Value });
                stepCommand.Parameters.Add(new NpgsqlParameter("Event", NpgsqlDbType.Text) { Value = MapExecutionEvent(step.Event) });
                stepCommand.Parameters.Add(new NpgsqlParameter("TimestampStart", NpgsqlDbType.TimestampTz) { Value = step.TimestampStart });
                stepCommand.Parameters.Add(new NpgsqlParameter("DurationMs", NpgsqlDbType.Bigint) { Value = step.DurationMs });
                stepCommand.Parameters.Add(new NpgsqlParameter("Logs", NpgsqlDbType.Jsonb) { Value = JsonSerializer.Serialize(step.Logs) });

                await stepCommand.ExecuteNonQueryAsync(cancellationToken);
            }

            await transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            //rollback, then re-throw the exception
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public Task<IReadOnlyList<Trace>> GetUserTraces(long id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    #region Helpers
    private static string MapExecutionEvent(ExecutionEvent executionEvent)
    {
        return executionEvent switch
        {
            ExecutionEvent.Success => "success",
            ExecutionEvent.ShortCircuit => "short-circuit",
            ExecutionEvent.Error => "error",
            _ => throw new ArgumentOutOfRangeException(executionEvent.ToString(), "Unknown execution event.")
        };
    }

    private static string MapFlowDirection(FlowDirection flowDirection)
    {
        return flowDirection switch
        {
            FlowDirection.Downstream => "downstream",
            FlowDirection.Upstream => "upstream",
            _ => throw new ArgumentOutOfRangeException(flowDirection.ToString(), "Unknown flow direction.")
        };
    }
    #endregion Helpers
}
