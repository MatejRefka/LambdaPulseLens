import { useState } from "react";
import { mockTraces } from "../data/mockTelemetry";
import type { Trace } from "../types/telemetry";
import { Sidebar } from "../features/dashboard/components/Sidebar/Sidebar";
import { TraceInspector } from "../features/dashboard/components/TraceViewer/TraceViewer";

export const DashboardPage = () => {
  const [selectedTrace, setSelectedTrace] = useState<Trace>(mockTraces[0]);

  const handleSelectTrace = (traceId: string) => {
    const trace = mockTraces.find((mockTrace) => mockTrace.id === traceId);
    if (trace) {
      setSelectedTrace(trace);
    }
  };

  return (
    //wrapper
    <div className="min-h-screen bg-surface-10">
      {/*mobile or tablet. < 1024px width */}
      <div className="flex lg:hidden h-screen flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Screen Too Small</h2>
        <p className="text-text-30 max-w-md">
          The Lambda Pulse dashboard requires a larger display to render the telemetry pipeline. Please view this
          application on a laptop or a desktop monitor.
        </p>
      </div>

      {/* laptop or desktop. <= 1920px width. 2k and 4k are locked at 1920px width*/}
      <div className="hidden lg:flex h-screen w-full max-w-480 mx-auto overflow-hidden text-text-20 relative shadow-2xl">
        {/* sidebar */}
        <Sidebar traces={mockTraces} selectedTraceId={selectedTrace.id} onSelectTrace={handleSelectTrace} />

        {/* trace inspector */}
        <TraceInspector key={selectedTrace.id} trace={selectedTrace} />
      </div>
    </div>
  );
};
