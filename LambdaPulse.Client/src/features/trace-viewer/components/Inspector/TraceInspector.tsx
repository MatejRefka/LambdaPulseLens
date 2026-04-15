import type { Trace } from "../../../../types/telemetry";
import { LogTimeline } from "../PipelineParts/LogTimeline";
import { PipelineLayout } from "./PipelineLayout";
import { useState } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeProvider";

interface TraceInspectorProps {
  trace: Trace;
}

export const TraceInspector = ({ trace }: TraceInspectorProps) => {
  const [activeLogItem, setActiveLogItem] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-10">
      {/*pipeline container*/}
      <div className="flex-1 flex flex-col pl-12 pr-6 overflow-y-auto">
        <PipelineLayout trace={trace} onLogClick={setActiveLogItem} />
      </div>

      {/*site utilities + log timeline*/}
      <div className="w-100 shrink-0 flex flex-col">
        {/*utility buttons*/}
        <div className="h-14 px-8 flex justify-end items-center gap-1">
          <button
            aria-label="Toggle Theme"
            className="p-2 rounded-md text-text-30 hover:text-text-10 hover:bg-surface-20 transition-all cursor-pointer"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <button
            aria-label="Log out"
            className="p-2 rounded-md text-text-30 hover:text-danger-10 hover:bg-danger-10/10 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/*log timeline*/}
        <div className="flex-1 overflow-y-auto p-6 mt-2">
          <LogTimeline pipeline={trace.pipeline} activeLogItem={activeLogItem} />
        </div>
      </div>
    </div>
  );
};
