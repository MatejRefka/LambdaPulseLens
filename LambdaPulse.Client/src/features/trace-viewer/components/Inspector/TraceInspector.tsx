import type { Trace } from "../../../../types/telemetry";
import { PipelineLayout } from "./PipelineLayout";

interface TraceInspectorProps {
  trace: Trace;
}

export const TraceInspector = ({ trace }: TraceInspectorProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-surface-10">
      {/*pipeline container*/}
      <div className="flex-1 flex flex-col px-12">
        <PipelineLayout trace={trace} />
      </div>
    </div>
  );
};
