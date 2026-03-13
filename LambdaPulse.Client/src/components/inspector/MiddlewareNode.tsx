import type { Step } from "../../types/telemetry";

interface MiddlewareNodeProps {
  middlewareName: string;
  stepData?: Step;
}

export const MiddlewareNode = ({ middlewareName, stepData }: MiddlewareNodeProps) => {
  const isActive = !!stepData;

  const getNodeStyle = () => {
    if (!isActive) {
      return "opacity-30 border-surface-40 bg-transparent text-surface-60 border-dashed";
    }
    switch (stepData.phase) {
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

  return (
    <div className={`p-3 rounded-lg border transition-all duration-300 w-full ${getNodeStyle()}`}>
      <div className="flex justify-between items-start gap-2">
        {/*middleware name*/}
        <span className={`text-sm font-bold truncate ${isActive ? "" : "font-medium"}`} title={middlewareName}>
          {middlewareName.replace("Middleware", "")} {/* Optional: Strip "Middleware" to save space */}
        </span>

        {/*duration*/}
        {isActive && (
          <data value={stepData.durationMs} className="font-mono text-xs opacity-90 whitespace-nowrap">
            {stepData.durationMs}ms
          </data>
        )}
      </div>

      {/*notes*/}
      {isActive && stepData.notes && (
        <p className="text-xs opacity-80 mt-2 border-l-2 border-current pl-2 truncate" title={stepData.notes}>
          {stepData.notes}
        </p>
      )}

      {/*phase badge*/}
      {isActive && (stepData.phase === "ShortCircuit" || stepData.phase === "Exception") && (
        <div className="mt-2 text-[10px] uppercase tracking-wider font-bold opacity-80 border border-current rounded px-1.5 py-0.5 inline-block">
          {stepData.phase}
        </div>
      )}
    </div>
  );
};
