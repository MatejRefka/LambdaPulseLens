import type { Trace } from "../../types/telemetry";
import { InspectorFrame } from "../inspector/InspectorFrame";

interface TraceInspectorProps {
  trace: Trace;
}

export const TraceInspector = ({ trace }: TraceInspectorProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-surface-10">
      {/*pipeline container*/}
      <div className="flex-1 flex flex-col px-12">
        <InspectorFrame trace={trace} />
      </div>
    </div>
  );
};
