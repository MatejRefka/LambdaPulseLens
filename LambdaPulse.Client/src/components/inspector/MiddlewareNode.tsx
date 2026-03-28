import type { Step } from "../../types/telemetry";

interface MiddlewareNodeProps {
  middlewareName: string;
  step?: Step;
}

export const MiddlewareNode = ({ middlewareName, step }: MiddlewareNodeProps) => {
  const isActive = !!step;

  const getNodeStyle = () => {
    if (!isActive) {
      return "opacity-30 border-surface-40 bg-transparent text-surface-60 border-dashed";
    }
    switch (step.phase) {
      case "Enter":
        return "opacity-100 border-blue-500/50 bg-blue-500/10 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]";
      case "Exit":
        return "opacity-100 border-success-30/50 bg-success-10/10 text-success-30 shadow-[0_0_15px_rgba(34,197,94,0.15)]";
      case "ShortCircuit":
        return "opacity-100 border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]";
      case "Exception":
        return "opacity-100 border-primary-50/50 bg-primary-10/10 text-primary-50 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
      default:
        return "opacity-100 border-surface-40 bg-surface-30 text-white";
    }
  };

  const displayName = middlewareName.replace("Middleware", "");
  const hasNotes = isActive && !!step.notes;

  return (
    <div
      className={`relative flex flex-col justify-center px-3 h-14 rounded-lg border transition-all duration-300 w-full overflow-hidden ${getNodeStyle()}`}
    >
      {/*top row*/}
      <div className="flex justify-between items-center gap-2">
        {/*middleware name*/}
        <span className={`text-sm truncate ${isActive ? "font-bold" : "font-medium"}`} title={displayName}>
          {displayName}
        </span>

        {/*duration*/}
        {isActive && (
          <data value={step.durationMs} className="font-mono text-xs opacity-90 whitespace-nowrap">
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

        {/*notes indicator*/}
        {hasNotes && (
          <div className="flex items-center gap-1 cursor-help" title="Feature in development">
            <span className="text-[10px] opacity-70 font-medium tracking-wide">NOTES</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current opacity-80"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
