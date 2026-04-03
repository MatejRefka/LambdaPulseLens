import type { Trace } from "../../../../types/telemetry";

interface TraceItemProps {
  trace: Trace;
  isSelected: boolean;
  onClick: () => void;
}

export const TraceItem = ({ trace, isSelected, onClick }: TraceItemProps) => {
  const traceContainerStyle = isSelected
    ? "bg-surface-40"
    : "border border-surface-60 cursor-pointer hover:bg-surface-30 hover:border-surface-30 shadow-md";

  const badgeStyle = isSelected ? "border-surface-60" : "border-surface-40";
  const badgeStyleHover = isSelected ? "group-hover:border-surface-60" : "group-hover:border-surface-30";

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left p-3 rounded-lg text-text-20 transition-colors ${traceContainerStyle}`}
    >
      {/*method + status code*/}
      <div className=" flex justify-between items-center mb-1">
        <span className="text-sm font-bold">{trace.request.method}</span>
        <div className={`text-xs px-2 py-0.5 rounded border ${badgeStyle} ${badgeStyleHover}`}>
          {trace.response.statusCode} {trace.response.responsePhrase}
        </div>
      </div>

      {/*path*/}
      <div className="truncate text-sm">{trace.request.path}</div>

      {/*duration + timestamp*/}
      <div className={`text-xs mt-1 flex justify-between text-text-30 font-medium`}>
        <span>{trace.durationMs}ms</span>
        <span>{new Date(trace.timestampStart).toLocaleTimeString()}</span>
      </div>
    </button>
  );
};
