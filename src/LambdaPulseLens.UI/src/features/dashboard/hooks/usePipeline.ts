import type { Step, Trace } from "../../../types/telemetry";
import { STATIC_PIPELINE } from "../../../utils/constants";

export const usePipeline = (trace: Trace) => {
  const getDownstreamStep = (middlewareName: string): Step | undefined => {
    return trace.steps.find(
      (step) => step.middleware === middlewareName && (step.direction === "downstream" || !step.direction)
    );
  };

  const getUpstreamStep = (middlewareName: string): Step | undefined => {
    return trace.steps.find((step) => step.middleware === middlewareName && step.direction === "upstream");
  };

  const hasShortCircuit = (middlewareName: string) => {
    const step = getDownstreamStep(middlewareName);
    return step?.event === "short-circuit" || step?.event === "error";
  };

  const errorStep = trace.steps.find((step) => step.event === "error");
  const errorMiddlewareIndex = errorStep ? STATIC_PIPELINE.indexOf(errorStep.middleware) : -1;
  const errorWasHandled = trace.steps.some(
    (step) => step.middleware === STATIC_PIPELINE[0] && step.direction === "upstream"
  );

  const isErrorPropagationWire = (middlewareName: string) => {
    const middlewareIndex = STATIC_PIPELINE.indexOf(middlewareName);
    return errorWasHandled && middlewareIndex >= 0 && middlewareIndex < errorMiddlewareIndex;
  };

  return { getDownstreamStep, getUpstreamStep, hasShortCircuit, isErrorPropagationWire };
};
