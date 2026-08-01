using LambdaPulse.Features.Logging;
using System.Globalization;
using System.Threading.Channels;

namespace LambdaPulse.Server.Services.Telemetry;

internal sealed class TraceRecorder : ITraceRecorder, IAsyncDisposable
{
    //thread-safe queue holding Traces
    private readonly Channel<Trace> _channel;

    //processor task running in the background, processing Traces from the channel
    private readonly Task _processorTask;

    private readonly ITelemetryRepository _repository;
    private readonly ILiveTraceBroadcaster _liveTraceBroadcaster;
    private readonly IEngineLogger _engineLogger;

    public TraceRecorder(ITelemetryRepository repository, ILiveTraceBroadcaster liveTraceBroadcaster, IEngineLogger engineLogger)
    {
        _repository = repository;
        _liveTraceBroadcaster = liveTraceBroadcaster;
        _engineLogger = engineLogger;

        var options = new BoundedChannelOptions(10000)
        {
            FullMode = BoundedChannelFullMode.DropOldest,
            SingleWriter = false, //each request is on its own thread. So many separate threads writing to this one channel
            SingleReader = true //one background task is reading from the channel. Avoids read locks
        };

        _channel = Channel.CreateBounded<Trace>(options);

        //start the processor task on instantiation
        _processorTask = Task.Run(() => ProcessChannel());
    }

    public void Record(Trace trace)
    {
        var written = _channel.Writer.TryWrite(trace);

        if (!written)
        {
            _engineLogger.Log(LogLevel.Error, "TraceRecorder", "Failed to record trace. Channel is full.");
        }
    }

    private async Task ProcessChannel()
    {
        //wait for a trace to be placed into the channel
        await foreach (var trace in _channel.Reader.ReadAllAsync())
        {
            try
            {
                if (long.TryParse(trace.UserId, CultureInfo.InvariantCulture, out var userId))
                {
                    var associatedTraces = await _repository.LinkAnonymousSessionToUser(trace.PreSessionToken, trace.AnonymousSessionToken, userId);

                    foreach (var associatedTrace in associatedTraces)
                    {
                        _liveTraceBroadcaster.Broadcast(associatedTrace);
                    }
                }

                //insert trace into Postgres
                var traceSummary = await _repository.InsertTrace(trace);

                //broadcast trace to live dashboard clients
                _liveTraceBroadcaster.Broadcast(traceSummary);
            }
            catch (Exception e)
            {
                _engineLogger.Log(LogLevel.Error, "TraceRecorder", "Failed to record trace.", e);
            }
        }
    }

    public async ValueTask DisposeAsync()
    {
        //stop accepting new Traces
        _channel.Writer.TryComplete();

        try
        {
            //wait for the processor task to finish processing existing Traces in the channel
            await _processorTask;
        }
        catch (Exception e)
        {
            _engineLogger.Log(LogLevel.Error, "TraceRecorder", "Trace recorder stopped with an error.", e);
        }
    }
}
