import type { Step } from "../../../../types/telemetry";
import { NotesTooltip } from "./NotesTooltip";

interface MiddlewareNodeProps {
  middlewareName: string;
  step?: Step;
}

const getNodeStyle = (isActive: boolean, event?: string) => {
  if (!isActive) {
    return "opacity-50 border-surface-50 bg-transparent text-surface-50 font-normal border-dashed";
  }
  const activeNode = "bg-surface-20 border-surface-40 border-l-4 shadow-sm";

  switch (event) {
    case "short-circuit":
      return `${activeNode} border-l-warning-20`;
    case "error":
      return `${activeNode} border-l-danger-10`;
    case "success":
    default:
      return `${activeNode} border-l-surface-50`;
  }
};

export const MiddlewareNode = ({ middlewareName, step }: MiddlewareNodeProps) => {
  const isActive = !!step;
  const displayName = middlewareName.replace("Middleware", "");
  const isCircuitBreak = step?.event === "short-circuit" || step?.event === "error";

  return (
    <div
      className={`relative flex flex-col justify-center px-3 h-14 rounded-lg border w-full ${getNodeStyle(isActive, step?.event)}`}
    >
      {/*top row*/}
      <div className="flex justify-between items-center gap-2">
        {/*middleware name*/}
        <span className="text-sm truncate font-normal">{displayName}</span>

        {/*duration*/}
        {isActive && <span className="text-xs text-text-30 whitespace-nowrap">{step.durationMs}ms</span>}
      </div>

      {/*bottom row*/}
      <div className="flex justify-between items-center mt-1 h-4">
        {/*short circuit or error badge*/}
        {isCircuitBreak && (
          <span className={`text-xs py-0.5 ${step.event === "error" ? "text-danger-10" : "text-warning-20"}`}>
            {step.event.replace("-", " ")}
          </span>
        )}

        {/*notes indicator and tooltip*/}
        {isActive && <NotesTooltip step={step} />}
      </div>
    </div>
  );
};
