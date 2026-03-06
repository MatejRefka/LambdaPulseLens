import type { Trace } from "../../types/telemetry";

interface TraceListItemProps {
  trace: Trace;
  isSelected: boolean;
  onClick: () => void;
}

export const TraceListItem = ({ trace, isSelected, onClick }: TraceListItemProps) => {
  const isError = trace.response.statusCode >= 400;

  const traceContainerStyle = isSelected
    ? "bg-surface-50 border-surface-50 text-black shadow-md"
    : "border-surface-40 cursor-pointer hover:bg-surface-30 hover:border-surface-30";

  let statusCodeBadgeStyle = "";
  if (isError) {
    statusCodeBadgeStyle = isSelected
      ? "text-primary-50 bg-primary-10/40 border-primary-10/30"
      : "bg-primary-10/10 border-primary-10/30";
  } else {
    statusCodeBadgeStyle = isSelected
      ? "text-success-30 bg-success-10/40 border-success-10/30"
      : "bg-success-10/10 border-success-10/30";
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors border ${traceContainerStyle}`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold">{trace.request.method}</span>
        <span className={`inline-block text-xs px-2 py-0.5 rounded border ${statusCodeBadgeStyle}`}>
          {trace.response.statusCode} {trace.response.responsePhrase}
        </span>
      </div>

      <div className="truncate text-sm" title={trace.request.path}>
        {trace.request.path}
      </div>

      <div className={`text-xs mt-1 flex justify-between ${isSelected ? "text-black" : "text-surface-60"}`}>
        <span>{trace.durationMs}ms</span>
        <span>{new Date(trace.timestampStart).toLocaleTimeString()}</span>
      </div>
    </button>
  );
};
