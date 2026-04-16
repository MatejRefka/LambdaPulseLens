import { useState } from "react";
import { mockTraces } from "../data/mockTelemtry";
import type { Trace } from "../types/telemetry";
import { Sidebar } from "../features/trace-viewer/components/Sidebar/Sidebar";
import { TraceInspector } from "../features/trace-viewer/components/TraceInspector";

export const DashboardPage = () => {
  const [selectedTrace, setSelectedTrace] = useState<Trace>(mockTraces[0]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface-10 text-text-20">
      {/*sidebar*/}
      <Sidebar traces={mockTraces} selectedTraceId={selectedTrace.id} onSelectTrace={setSelectedTrace} />

      {/*trace inspector*/}
      <TraceInspector key={selectedTrace.id} trace={selectedTrace} />
    </div>
  );
};
