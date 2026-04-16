import type { Step } from "../../../../../../types/telemetry";
import { cn } from "../../../../../../utils/cn";

interface MiddlewareNodeProps {
  middlewareName: string;
  step?: Step;
  onLogClick: (activeLogItem: string) => void;
}

const getNodeStyle = (isActive: boolean, event?: string) => {
  if (!isActive) {
    return "opacity-50 border-surface-50 bg-transparent text-surface-50 font-normal border-dashed";
  }
  const activeNode = "bg-surface-20 border-surface-40 border-l-4";

  switch (event) {
    case "short-circuit":
      return cn(activeNode, "border-l-warning-20");
    case "error":
      return cn(activeNode, "border-l-danger-10");
    case "success":
    default:
      return cn(activeNode, "border-l-surface-50");
  }
};

export const MiddlewareNode = ({ middlewareName, step, onLogClick }: MiddlewareNodeProps) => {
  const isActive = !!step;
  const hasLogs = !!step?.logs;
  const isCircuitBreak = step?.event === "short-circuit" || step?.event === "error";

  return (
    <div
      className={cn(
        "relative flex flex-col justify-center px-3 h-14 rounded-lg border w-full",
        getNodeStyle(isActive, step?.event)
      )}
    >
      {/*top row*/}
      <div className="flex justify-between items-center">
        {/*middleware name*/}
        <span className="text-sm truncate font-normal">{middlewareName}</span>
      </div>

      {/*bottom row*/}
      <div className="flex justify-between items-center mt-1 h-5">
        {/*duration*/}
        {isActive && <span className="text-xs text-text-30 whitespace-nowrap">{step.durationMs}ms</span>}

        {/*short circuit or error badge*/}
        {isCircuitBreak && (
          <span className={cn("text-xs py-0.5", step.event === "error" ? "text-danger-10" : "text-warning-20")}>
            {step.event.replace("-", " ")}
          </span>
        )}

        {/*logs indicator*/}
        {isActive && hasLogs && (
          <button
            className="text-[10px] text-text-30 tracking-wide border-b border-dotted border-text-30 hover:cursor-pointer hover:text-text-20 transition-colors pb-px"
            onClick={() => onLogClick(`${step.middleware}-${step.direction}`)}
          >
            LOGS
          </button>
        )}
      </div>
    </div>
  );
};
