using System.Collections.Concurrent;
using System.Threading.Channels;

namespace LambdaPulse.Server.Services.Telemetry;

internal sealed class LiveTraceBroadcaster : ILiveTraceBroadcaster
{
    //stores all SSE connections. Each user has client(s), who have their own channel to receive trace summaries.
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<Guid, Channel<TraceSummary>>> _subscribers = new();

    public ChannelReader<TraceSummary> Subscribe(string userId, Guid subscriberId)
    {
        var options = new BoundedChannelOptions(500)
        {
            FullMode = BoundedChannelFullMode.DropOldest,
            SingleWriter = false,
            SingleReader = true
        };

        var channel = Channel.CreateBounded<TraceSummary>(options);

        //get channels for the user, or create a new dictionary if it doesn't exist
        var userConnections = _subscribers.GetOrAdd(userId, _ => new ConcurrentDictionary<Guid, Channel<TraceSummary>>());
        //set the channel for this subscriberId
        userConnections[subscriberId] = channel;

        return channel.Reader;
    }

    public void Unsubscribe(string userId, Guid subscriberId)
    {
        if (_subscribers.TryGetValue(userId, out var userConnections))
        {
            if (userConnections.TryRemove(subscriberId, out var channel))
            {
                channel.Writer.TryComplete();
            }

            //remove entry if user has no more channels
            if (userConnections.IsEmpty)
            {
                _subscribers.TryRemove(userId, out _);
            }
        }
    }

    //broadcasts a trace summary to all connected SSE subscribers
    public void Broadcast(TraceSummary traceSummary)
    {
        if (traceSummary.UserId != null && _subscribers.TryGetValue(traceSummary.UserId, out var userConnections))
        {
            foreach (var channel in userConnections.Values)
            {
                channel.Writer.TryWrite(traceSummary);
            }
        }
    }
}
