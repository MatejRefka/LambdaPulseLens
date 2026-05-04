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

  const hasShortCircuit = (middlewareName: string) => {
    const step = getDownstreamStep(middlewareName);
    return step?.event === "short-circuit" || step?.event === "error";
  };

  return { getDownstreamStep, getUpstreamStep, hasShortCircuit };
};
