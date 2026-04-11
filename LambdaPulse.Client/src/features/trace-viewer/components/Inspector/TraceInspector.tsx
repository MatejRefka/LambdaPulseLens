import type { Trace } from "../../../../types/telemetry";
import { LogTimeline } from "../PipelineParts/LogTimeline";
import { PipelineLayout } from "./PipelineLayout";
import { useState, useEffect } from "react";

interface TraceInspectorProps {
  trace: Trace;
}

const ThemeIcon = () => <span className="cursor-pointer hover:text-text-10 transition-colors">🌙</span>;
const LogoutIcon = () => <span className="cursor-pointer hover:text-text-10 transition-colors">🚪</span>;

export const TraceInspector = ({ trace }: TraceInspectorProps) => {
  const [activeLogItem, setActiveLogItem] = useState<string | null>(null);

  //reset the active LogItem when new TraceItem is selected
  useEffect(() => {
    setActiveLogItem(null);
  }, [trace.id]);

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-10">
      {/*pipeline container*/}
      <div className="flex-1 flex flex-col pl-12 pr-6 overflow-y-auto">
        <PipelineLayout trace={trace} onLogClick={setActiveLogItem} />
      </div>

      {/*site utilities + log timeline*/}
      <div className="w-100 shrink-0 flex flex-col">
        <div className="h-14 shrink-0 px-8 flex justify-end items-center gap-4">
          <ThemeIcon />
          <LogoutIcon />
        </div>

        <div className="flex-1 overflow-y-auto p-6 mt-2">
          <LogTimeline pipeline={trace.pipeline} activeLogItem={activeLogItem} />
        </div>
      </div>
    </div>
  );
};
