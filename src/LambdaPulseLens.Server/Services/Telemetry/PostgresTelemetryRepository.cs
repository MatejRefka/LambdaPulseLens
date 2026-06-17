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
        if (trace.ResponseStatusCode == null)
        {
            throw new InvalidOperationException("Missing trace response status code.");
        }

        if (trace.ResponsePhrase == null)
        {
            throw new InvalidOperationException("Missing trace response phrase.");
        }

        //server implementation using long/bigint type for user id
        long? traceUserId = null;
        if (!string.IsNullOrWhiteSpace(trace.UserId) && long.TryParse(trace.UserId, CultureInfo.InvariantCulture, out var parsedUserId))
        {
            traceUserId = parsedUserId;
        }

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        //wrap in a transaction (one trace -> many steps)
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);

        try
        {
            var insertTraceSql = @"INSERT INTO telemetry.traces (user_id, timestamp_start, duration_ms, req_method, req_path, req_protocol, res_status_code, res_phrase)
                                   VALUES (@UserId, @TimestampStart, @DurationMs, @ReqMethod, @ReqPath, @ReqProtocol, @ResStatusCode, @ResPhrase) 
                                   RETURNING id;";

            await using var traceCommand = new NpgsqlCommand(insertTraceSql, connection, transaction);

            traceCommand.Parameters.Add(new NpgsqlParameter("UserId", NpgsqlDbType.Bigint) { Value = traceUserId.HasValue ? traceUserId.Value : DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("TimestampStart", NpgsqlDbType.TimestampTz) { Value = trace.TimestampStart });
            traceCommand.Parameters.Add(new NpgsqlParameter("DurationMs", NpgsqlDbType.Bigint) { Value = trace.DurationMs });
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqMethod", NpgsqlDbType.Varchar) { Value = (object?)trace.RequestMethod ?? DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqPath", NpgsqlDbType.Text) { Value = (object?)trace.RequestPath ?? DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ReqProtocol", NpgsqlDbType.Varchar) { Value = (object?)trace.RequestProtocol ?? DBNull.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ResStatusCode", NpgsqlDbType.Integer) { Value = trace.ResponseStatusCode.Value });
            traceCommand.Parameters.Add(new NpgsqlParameter("ResPhrase", NpgsqlDbType.Text) { Value = trace.ResponsePhrase });

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

    public async Task<IReadOnlyList<TraceSummaryRecord>> GetTraceSummaries(long userId, CancellationToken cancellationToken = default)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var selectTraceSummariesSql = @"SELECT id,
                                               user_id,
                                               timestamp_start,
                                               duration_ms,
                                               req_method,
                                               req_path,
                                               req_protocol,
                                               res_status_code,
                                               res_phrase
                                        FROM telemetry.traces
                                        WHERE user_id = @UserId
                                        ORDER BY id DESC;";

        await using var command = new NpgsqlCommand(selectTraceSummariesSql, connection);
        command.Parameters.Add(new NpgsqlParameter("UserId", NpgsqlDbType.Bigint) { Value = userId });

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        var traces = new List<TraceSummaryRecord>();
        while (await reader.ReadAsync(cancellationToken))
        {
            traces.Add(new TraceSummaryRecord
            {
                Id = reader.GetInt64(reader.GetOrdinal("id")),
                UserId = reader.IsDBNull(reader.GetOrdinal("user_id")) ? null : reader.GetInt64(reader.GetOrdinal("user_id")),
                TimestampStart = reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("timestamp_start")),
                DurationMs = reader.GetInt64(reader.GetOrdinal("duration_ms")),
                RequestMethod = reader.IsDBNull(reader.GetOrdinal("req_method")) ? null : reader.GetString(reader.GetOrdinal("req_method")),
                RequestPath = reader.IsDBNull(reader.GetOrdinal("req_path")) ? null : reader.GetString(reader.GetOrdinal("req_path")),
                RequestProtocol = reader.IsDBNull(reader.GetOrdinal("req_protocol")) ? null : reader.GetString(reader.GetOrdinal("req_protocol")),
                ResponseStatusCode = reader.GetInt32(reader.GetOrdinal("res_status_code")),
                ResponsePhrase = reader.GetString(reader.GetOrdinal("res_phrase"))
            });
        }

        return traces;
    }

    public async Task<Trace?> GetTrace(long traceId, long userId, CancellationToken cancellationToken = default)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var selectTracesSql = @"SELECT traces.id AS trace_id,
                                       traces.user_id AS trace_user_id,
                                       traces.timestamp_start AS trace_timestamp_start,
                                       traces.duration_ms AS trace_duration_ms,
                                       traces.req_method AS trace_req_method,
                                       traces.req_path AS trace_req_path,
                                       traces.req_protocol AS trace_req_protocol,
                                       traces.res_status_code AS trace_res_status_code,
                                       traces.res_phrase AS trace_res_phrase,
                                       steps.id AS step_id,
                                       steps.middleware AS step_middleware,
                                       steps.direction::text AS step_direction,
                                       steps.event::text AS step_event,
                                       steps.timestamp_start AS step_timestamp_start,
                                       steps.duration_ms AS step_duration_ms,
                                       steps.logs::text AS step_logs
                                FROM telemetry.traces traces 
                                LEFT JOIN telemetry.steps steps ON steps.trace_id = traces.id
                                WHERE traces.id = @TraceId AND traces.user_id = @UserId
                                ORDER BY steps.id ASC;";

        await using var command = new NpgsqlCommand(selectTracesSql, connection);
        command.Parameters.Add(new NpgsqlParameter("TraceId", NpgsqlDbType.Bigint) { Value = traceId });
        command.Parameters.Add(new NpgsqlParameter("UserId", NpgsqlDbType.Bigint) { Value = userId });

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);

        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        var trace = new Trace
        {
            Id = traceId.ToString(CultureInfo.InvariantCulture),
            UserId = reader.IsDBNull(reader.GetOrdinal("trace_user_id")) ? null : reader.GetInt64(reader.GetOrdinal("trace_user_id")).ToString(CultureInfo.InvariantCulture),
            TimestampStart = reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("trace_timestamp_start")),
            DurationMs = reader.GetInt64(reader.GetOrdinal("trace_duration_ms")),
            RequestMethod = reader.IsDBNull(reader.GetOrdinal("trace_req_method")) ? null : reader.GetString(reader.GetOrdinal("trace_req_method")),
            RequestPath = reader.IsDBNull(reader.GetOrdinal("trace_req_path")) ? null : reader.GetString(reader.GetOrdinal("trace_req_path")),
            RequestProtocol = reader.IsDBNull(reader.GetOrdinal("trace_req_protocol")) ? null : reader.GetString(reader.GetOrdinal("trace_req_protocol")),
            ResponseStatusCode = reader.GetInt32(reader.GetOrdinal("trace_res_status_code")),
            ResponsePhrase = reader.GetString(reader.GetOrdinal("trace_res_phrase")),
            Steps = new List<MiddlewareStep>()
        };

        //add the first step (first row)
        if (!reader.IsDBNull(reader.GetOrdinal("step_id")))
        {
            trace.Steps.Add(new MiddlewareStep
            {
                Middleware = reader.GetString(reader.GetOrdinal("step_middleware")),
                Direction = reader.IsDBNull(reader.GetOrdinal("step_direction")) ? null : MapDBFlowDirection(reader.GetString(reader.GetOrdinal("step_direction"))),
                Event = MapDBExecutionEvent(reader.GetString(reader.GetOrdinal("step_event"))),
                TimestampStart = reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("step_timestamp_start")),
                DurationMs = reader.GetInt64(reader.GetOrdinal("step_duration_ms")),
                Logs = reader.IsDBNull(reader.GetOrdinal("step_logs")) ? [] : JsonSerializer.Deserialize<List<string>>(reader.GetString(reader.GetOrdinal("step_logs"))) ?? []
            });
        }

        //add the remaining steps (other rows)
        while (await reader.ReadAsync(cancellationToken))
        {
            if (!reader.IsDBNull(reader.GetOrdinal("step_id")))
            {
                trace.Steps.Add(new MiddlewareStep
                {
                    Middleware = reader.GetString(reader.GetOrdinal("step_middleware")),
                    Direction = reader.IsDBNull(reader.GetOrdinal("step_direction")) ? null : MapDBFlowDirection(reader.GetString(reader.GetOrdinal("step_direction"))),
                    Event = MapDBExecutionEvent(reader.GetString(reader.GetOrdinal("step_event"))),
                    TimestampStart = reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("step_timestamp_start")),
                    DurationMs = reader.GetInt64(reader.GetOrdinal("step_duration_ms")),
                    Logs = reader.IsDBNull(reader.GetOrdinal("step_logs")) ? [] : JsonSerializer.Deserialize<List<string>>(reader.GetString(reader.GetOrdinal("step_logs"))) ?? []
                });
            }
        }

        return trace;
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

    private static ExecutionEvent MapDBExecutionEvent(string executionEvent)
    {
        return executionEvent switch
        {
            "success" => ExecutionEvent.Success,
            "short-circuit" => ExecutionEvent.ShortCircuit,
            "error" => ExecutionEvent.Error,
            _ => throw new ArgumentOutOfRangeException(executionEvent, "Unknown execution event.")
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

    private static FlowDirection MapDBFlowDirection(string flowDirection)
    {
        return flowDirection switch
        {
            "downstream" => FlowDirection.Downstream,
            "upstream" => FlowDirection.Upstream,
            _ => throw new ArgumentOutOfRangeException(flowDirection, "Unknown flow direction.")
        };
    }
    #endregion Helpers
}
