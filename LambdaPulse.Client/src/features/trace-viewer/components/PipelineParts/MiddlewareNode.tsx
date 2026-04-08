import type { Step } from "../../../../types/telemetry";

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
  const hasLogs = !!step?.logs;
  const isCircuitBreak = step?.event === "short-circuit" || step?.event === "error";

  return (
    <div
      className={`relative flex flex-col justify-center px-3 h-14 rounded-lg border w-full ${getNodeStyle(isActive, step?.event)}`}
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
          <span className={`text-xs py-0.5 ${step.event === "error" ? "text-danger-10" : "text-warning-20"}`}>
            {step.event.replace("-", " ")}
          </span>
        )}

        {/*notes indicator and tooltip*/}
        {isActive && hasLogs && (
          <button className="text-[10px] text-text-30 tracking-wide border-b border-dotted border-text-30 hover:cursor-pointer hover:text-text-20 transition-colors pb-px">
            LOGS
          </button>
        )}
      </div>
    </div>
  );
};
