import type { Step } from "../../../../types/telemetry";
import { NotesTooltip } from "./NotesTooltip";

interface MiddlewareNodeProps {
  middlewareName: string;
  step?: Step;
}

const getNodeStyle = (isActive: boolean, phase?: string) => {
  if (!isActive) {
    return "opacity-50 border-surface-50 bg-transparent text-surface-50 font-normal border-dashed";
  }
  const activeNode = "bg-surface-20 border-surface-40 border-l-4 shadow-sm";

  switch (phase) {
    case "Enter":
      return `${activeNode} border-l-blue-500`;
    case "Exit":
      return `${activeNode} border-l-green-500`;
    case "ShortCircuit":
      return `${activeNode} border-l-orange-500`;
    case "Exception":
      return `${activeNode} border-l-brand-10`;
    default:
      return `${activeNode} border-l-surface-50`;
  }
};

export const MiddlewareNode = ({ middlewareName, step }: MiddlewareNodeProps) => {
  const isActive = !!step;

  const displayName = middlewareName.replace("Middleware", "");

  return (
    <div
      className={`relative flex flex-col justify-center px-3 h-14 rounded-lg border transition-all duration-300 w-full ${getNodeStyle(isActive, step?.phase)}`}
    >
      {/*top row*/}
      <div className="flex justify-between items-center gap-2">
        {/*middleware name*/}
        <span className="text-sm truncate font-normal">{displayName}</span>

        {/*duration*/}
        {isActive && (
          <data value={step.durationMs} className="text-xs text-text-30 whitespace-nowrap">
            {step.durationMs}ms
          </data>
        )}
      </div>

      {/*bottom row*/}
      <div className="flex justify-between items-center mt-1 h-4">
        {/*phase badge*/}
        {isActive ? (
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border ${
              step.phase === "ShortCircuit" || step.phase === "Exception"
                ? "border-current opacity-100"
                : "border-transparent opacity-60"
            }`}
          >
            {step.phase}
          </span>
        ) : (
          <span className="text-[10px]">&nbsp;</span>
        )}

        {/*notes indicator and tooltip*/}
        {isActive && <NotesTooltip step={step} />}
      </div>
    </div>
  );
};
