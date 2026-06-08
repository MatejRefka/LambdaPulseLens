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
            var insertTraceSql = @"INSERT INTO telemetry.traces (timestamp_start, duration_ms, req_method, req_path, req_protocol, req_headers, req_cookies, req_body, res_status_code, res_phrase, res_headers, res_cookies, res_body)
                                   VALUES (@TimestampStart, @DurationMs, @ReqMethod, @ReqPath, @ReqProtocol, @ReqHeaders, @ReqCookies, @ReqBody, @ResStatusCode, @ResPhrase, @ResHeaders, @ResCookies, @ResBody) 
                                   RETURNING id;";

            await using var traceCommand = new NpgsqlCommand(insertTraceSql, connection, transaction);

            traceCommand.Parameters.AddWithValue("TimestampStart", trace.TimestampStart);
            traceCommand.Parameters.AddWithValue("DurationMs", trace.DurationMs);
            traceCommand.Parameters.AddWithValue("ReqMethod", (object?)trace.RequestMethod ?? DBNull.Value);
            traceCommand.Parameters.AddWithValue("ReqPath", (object?)trace.RequestPath ?? DBNull.Value);
            traceCommand.Parameters.AddWithValue("ReqProtocol", (object?)trace.RequestProtocol ?? DBNull.Value);
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqHeaders", NpgsqlDbType.Jsonb) { Value = JsonSerializer.Serialize(trace.RequestHeaders) });
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqCookies", NpgsqlDbType.Jsonb) { Value = JsonSerializer.Serialize(trace.RequestCookies) });
            traceCommand.Parameters.AddWithValue("ReqBody", (object?)trace.RequestBody ?? DBNull.Value);
            traceCommand.Parameters.AddWithValue("ResStatusCode", (object?)trace.ResponseStatusCode ?? DBNull.Value);
            traceCommand.Parameters.AddWithValue("ResPhrase", (object?)trace.ResponsePhrase ?? DBNull.Value);
            traceCommand.Parameters.Add(new NpgsqlParameter("ResHeaders", NpgsqlDbType.Jsonb) { Value = JsonSerializer.Serialize(trace.ResponseHeaders) });
            traceCommand.Parameters.Add(new NpgsqlParameter("ResCookies", NpgsqlDbType.Jsonb) { Value = JsonSerializer.Serialize(trace.ResponseCookies) });
            traceCommand.Parameters.AddWithValue("ResBody", (object?)trace.ResponseBody ?? DBNull.Value);

            var rawTraceId = await traceCommand.ExecuteScalarAsync(cancellationToken);
            var traceId = Convert.ToInt64(rawTraceId, CultureInfo.InvariantCulture);

            var insertStepSql = @"INSERT INTO telemetry.steps (trace_id, middleware, direction, event, timestamp_start, duration_ms, logs)
                                   VALUES (@TraceId, @Middleware, CAST(@Direction AS telemetry.flow_direction), CAST(@Event AS telemetry.execution_event), @TimestampStart, @DurationMs, @Logs);";

            foreach (var step in trace.Steps)
            {
                await using var stepCommand = new NpgsqlCommand(insertStepSql, connection, transaction);
                stepCommand.Parameters.AddWithValue("TraceId", traceId);
                stepCommand.Parameters.AddWithValue("Middleware", step.Middleware);
                stepCommand.Parameters.AddWithValue("Direction", step.Direction.HasValue ? MapFlowDirection(step.Direction.Value) : DBNull.Value);
                stepCommand.Parameters.AddWithValue("Event", MapExecutionEvent(step.Event));
                stepCommand.Parameters.AddWithValue("TimestampStart", step.TimestampStart);
                stepCommand.Parameters.AddWithValue("DurationMs", step.DurationMs);
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
