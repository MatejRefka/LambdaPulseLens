import type { Trace } from "../../types/telemetry";
import { BrandLogo } from "../shared/BrandLogo";
import { TraceListItem } from "../dashboard/TraceListItem";

interface SidebarProps {
  traces: Trace[];
  selectedTraceId: number;
  onSelectTrace: (trace: Trace) => void;
}

export const Sidebar = ({ traces, selectedTraceId, onSelectTrace }: SidebarProps) => {
  return (
    <aside className="w-90 flex flex-col bg-surface-20 shadow-2xl z-10">
      <BrandLogo />

      {/*trace list*/}
      <div className="flex-1 flex flex-col px-4 gap-2 overflow-y-auto pb-4">
        {traces.map((trace) => (
          <TraceListItem
            key={trace.id}
            trace={trace}
            isSelected={selectedTraceId === trace.id}
            onClick={() => onSelectTrace(trace)}
          />
        ))}
      </div>
    </aside>
  );
};
