import type { Trace } from "../../types/telemetry";
import { TraceHeader } from "./TraceHeader";

interface TraceInspectorProps {
  trace: Trace;
}

export const TraceInspector = ({ trace }: TraceInspectorProps) => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden relative bg-surface-10">
      <TraceHeader trace={trace} />

      {/*pipeline container*/}
      <div className="flex-1 overflow-y-auto pb-6 px-12">
        <div className="flex flex-col items-center justify-center h-full min-h-100 border border-surface-30 rounded-2xl shadow-2xl">
          <p>Content: killer pipeline</p>
        </div>
      </div>
    </main>
  );
};
