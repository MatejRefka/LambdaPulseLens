import type { Trace } from "../../../../types/telemetry";
import { BrandLogo } from "../../../../components/shared/BrandLogo";
import { TraceItem } from "./TraceItem";

interface SidebarProps {
  traces: Trace[];
  selectedTraceId: number;
  onSelectTrace: (trace: Trace) => void;
}

export const Sidebar = ({ traces, selectedTraceId, onSelectTrace }: SidebarProps) => {
  return (
    <div className="w-65 2xl:w-85 flex flex-col bg-surface-20 shadow-sm z-10">
      {/*brand logo*/}
      <BrandLogo />

      {/*trace list*/}
      <div className="flex-1 flex flex-col px-2 2xl:px-4 gap-2 overflow-y-auto pb-4 scrollbar">
        {traces.map((trace) => (
          <TraceItem
            key={trace.id}
            trace={trace}
            isSelected={selectedTraceId === trace.id}
            onClick={() => {
              onSelectTrace(trace);
            }}
          />
        ))}
      </div>
    </div>
  );
};
