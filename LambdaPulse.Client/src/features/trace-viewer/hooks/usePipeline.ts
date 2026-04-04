import type { Step, Trace } from "../../../types/telemetry";

export const usePipeline = (trace: Trace) => {
  const getDownstreamStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find(
      (step) => step.middleware === middlewareName && (step.direction === "downstream" || !step.direction)
    );
  };

  const getUpstreamStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find((step) => step.middleware === middlewareName && step.direction === "upstream");
  };

  const getFlowDirection = (step?: Step): "request" | "response" | "error" => {
    if (!step) {
      return "request";
    }
    if (step.event === "short-circuit" || step.event === "error") {
      return "error";
    }
    return step.direction === "downstream" ? "request" : "response";
  };

  const hasShortCircuit = (middlewareName: string) => {
    const step = getDownstreamStep(middlewareName);
    return step?.event === "short-circuit" || step?.event === "error";
  };

  return { getDownstreamStep, getUpstreamStep, getFlowDirection, hasShortCircuit };
};
