using System.Threading.Channels;

namespace LambdaPulseLens.Server.Services.Telemetry;

internal interface ILiveTraceBroadcaster
{
    ChannelReader<TraceSummary> Subscribe(string userId, Guid subscriberId);

    void Unsubscribe(string userId, Guid subscriberId);

    void Broadcast(TraceSummary traceSummary);
}
