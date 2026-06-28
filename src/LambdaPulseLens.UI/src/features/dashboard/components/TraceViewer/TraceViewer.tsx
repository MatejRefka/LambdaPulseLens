import type { Trace } from "../../../../types/telemetry";
import { LogTimeline } from "./Logs/LogTimeline";
import { PipelineLayout } from "./Pipeline/PipelineLayout";
import { useState } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../contexts/useTheme";
import { useAuth } from "../../../../contexts/useAuth";

interface TraceInspectorProps {
  trace: Trace;
}

export const TraceInspector = ({ trace }: TraceInspectorProps) => {
  const [activeLogItem, setActiveLogItem] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      await navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-10">
      {/*pipeline container*/}
      <div className="flex-1 flex flex-col pl-2 2xl:pl-12 overflow-y-auto scrollbar">
        <PipelineLayout trace={trace} onLogClick={setActiveLogItem} />
      </div>

      {/*site utilities + log timeline*/}
      <div className="w-70 2xl:w-100 shrink-0 flex flex-col">
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
            onClick={() => void handleLogout()}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/*log timeline*/}
        <div className="flex-1 overflow-y-auto pr-2 2xl:py-4 2xl:pr-4 mt-2 2xl:mt-5">
          <LogTimeline pipeline={trace.steps} activeLogItem={activeLogItem} />
        </div>
      </div>
    </div>
  );
};
