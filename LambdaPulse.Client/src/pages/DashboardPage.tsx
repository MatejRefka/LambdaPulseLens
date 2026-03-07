import { useState } from "react";
import { mockTraces } from "../data/mockTelemtry";
import type { Trace } from "../types/telemetry";
import { Sidebar } from "../components/dashboard/Sidebar";
import { TraceInspector } from "../components/dashboard/TraceInspector";

export const DashboardPage = () => {
  const [selectedTrace, setSelectedTrace] = useState<Trace>(mockTraces[0]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface-10 text-white">
      {/*sidebar*/}
      <Sidebar traces={mockTraces} selectedTraceId={selectedTrace.id} onSelectTrace={setSelectedTrace} />

      {/*trace inspector*/}
      <TraceInspector trace={selectedTrace} />
    </div>
  );
};
