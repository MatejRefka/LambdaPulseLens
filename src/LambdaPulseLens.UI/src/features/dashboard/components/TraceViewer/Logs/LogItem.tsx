import type { Step } from "../../../../../types/telemetry";
import { useEffect, useRef } from "react";
import { cn } from "../../../../../utils/cn";

interface LogItemProps {
  step: Step;
  isActive: boolean;
}

export const LogItem = ({ step, isActive }: LogItemProps) => {
  //reference to this specific component (div) within the DOM
  const logItemRef = useRef<HTMLDivElement>(null);

  //runs after mount, and re-runs on 'isActive' value change
  useEffect(() => {
    if (isActive && logItemRef.current) {
      logItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive]);

  return (
    <div
      ref={logItemRef}
      className={cn(
        "pb-2 px-4 -mx-1 transition-all duration-500 border-t border-b",
        isActive ? "bg-surface-20 border-surface-40 opacity-100" : "border-transparent opacity-80"
      )}
    >
      {/*header*/}
      <span
        className={cn(
          "text-sm transition-opacity duration-500",
          isActive ? "text-text-20 opacity-100" : "text-text-20 opacity-90"
        )}
      >
        {step.middleware}
      </span>

      {/*logs*/}
      {step.logs && (
        <ul className="flex flex-col">
          {step.logs.map((log, index) => (
            <li key={index} className="text-xs text-text-30 whitespace-pre-wrap flex">
              <span className="text-text-30 mr-1">›</span>
              {log}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
