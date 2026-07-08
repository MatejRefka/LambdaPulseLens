import type { TraceSummary } from "../../../../types/telemetry";
import { cn } from "../../../../utils/cn";

interface TraceItemProps {
  trace: TraceSummary;
  isSelected: boolean;
  onClick: () => void;
}

export const TraceItem = ({ trace, isSelected, onClick }: TraceItemProps) => {
  const traceContainerStyle = isSelected
    ? "bg-surface-40"
    : "border border-surface-60 cursor-pointer hover:bg-surface-30 hover:border-surface-30";

  const badgeStyle = isSelected ? "border-surface-60" : "border-surface-50";
  const badgeStyleHover = isSelected ? "group-hover:border-surface-60" : "group-hover:border-surface-30";
  const method = trace.requestMethod ?? "Malformed";
  const path = trace.requestPath ?? "Request parse failed";

  return (
    <button
      onClick={onClick}
      className={cn("group w-full text-left py-2 px-1 2xl:p-3 rounded-lg", traceContainerStyle)}
    >
      {/*method + status code*/}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold">{method}</span>
        <div className={cn("text-xs px-2 py-0.5 rounded border", badgeStyle, badgeStyleHover)}>
          {trace.responseStatusCode} {trace.responsePhrase}
        </div>
      </div>

      {/*path*/}
      <div className="truncate text-sm">{path}</div>

      {/*duration + timestamp*/}
      <div className="text-xs mt-1 flex justify-between text-text-30 font-medium">
        <span>{trace.durationMs.toFixed(0)}ms</span>
        <span>{new Date(trace.timestampStart).toLocaleTimeString()}</span>
      </div>
    </button>
  );
};
