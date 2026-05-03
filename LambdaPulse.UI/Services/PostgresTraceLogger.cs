using LambdaPulse.Server.Features.Logging;
using Npgsql;
using NpgsqlTypes;
using System.Globalization;
using System.Text.Json;
using System.Threading.Channels;

namespace LambdaPulse.UI.Services;

internal sealed class PostgresTraceLogger : ITraceLogger, IAsyncDisposable
{
    //thread-safe queue holding Traces
    private readonly Channel<Trace> _channel;
    //processor task running in the background, processing Traces from the channel
    private readonly Task _processorTask;

    private readonly string _connectionString;
    private readonly IEngineLogger _engineLogger;
    private readonly CancellationTokenSource _cancellationTokenSource;

    public PostgresTraceLogger(PostgresConfig config, IEngineLogger engineLogger)
    {
        _connectionString = config.ConnectionString;
        _engineLogger = engineLogger;
        _cancellationTokenSource = new CancellationTokenSource();

        var options = new BoundedChannelOptions(10000)
        {
            FullMode = BoundedChannelFullMode.DropOldest,
            SingleWriter = false, //each request is on its own thread. So many separate threads writing this one channel
            SingleReader = true //one background task is reading from the channel. Avoids read
        };
        _channel = Channel.CreateBounded<Trace>(options);

        //start the processor task on instantiation
        _processorTask = Task.Run(() => ProcessChannel(_cancellationTokenSource.Token));
    }

    public void Log(Trace trace)
    {
        //write the trace to the channel queue
        _channel.Writer.TryWrite(trace);
    }

    private async Task ProcessChannel(CancellationToken cancellationToken)
    {
        //wait for a trace to be placed into the channel
        await foreach (var trace in _channel.Reader.ReadAllAsync(cancellationToken))
        {
            try
            {
                await InserTrace(trace, cancellationToken);
            }
            catch (Exception e)
            {
                _engineLogger.Log(LogLevel.Error, "Failed to save trace to Postgres", e);
            }
        }
    }

    private async Task InserTrace(Trace trace, CancellationToken cancellationToken)
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

            var rawtraceId = await traceCommand.ExecuteScalarAsync(cancellationToken);
            var traceId = Convert.ToInt64(rawtraceId, CultureInfo.InvariantCulture);

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

    public async ValueTask DisposeAsync()
    {
        //stop accepting new Traces
        _channel.Writer.Complete();

        //send cancellation signal downstream to postgres
        _cancellationTokenSource.Cancel();

        //wait for the processor task to finish processing existing Traces in the channel
        try
        {
            await _processorTask;
        }
        catch (TaskCanceledException) { }

        _cancellationTokenSource.Dispose();
    }
}
