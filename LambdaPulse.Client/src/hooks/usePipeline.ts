import type { Step, Trace } from "../types/telemetry";

export const usePipeline = (trace: Trace) => {
  const getRequestStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find(
      (step) => step.middleware === middlewareName && ["Enter", "ShortCircuit", "Exception"].includes(step.phase)
    );
  };

  const getResponseStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find((step) => step.middleware === middlewareName && step.phase === "Exit");
  };

  const getFlowDirection = (step?: Step) => {
    if (!step) {
      return "request";
    }
    if (step.phase === "ShortCircuit" || step.phase === "Exception") {
      return "error";
    }
    return step.phase === "Enter" ? "request" : "response";
  };

  const hasShortCircuit = (middlewareName: string) => {
    const requestStep = getRequestStep(middlewareName);
    return requestStep?.phase === "ShortCircuit" || requestStep?.phase === "Exception";
  };

  return { getRequestStep, getResponseStep, getFlowDirection, hasShortCircuit };
};
