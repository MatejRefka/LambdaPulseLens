import React from "react";
import type { Trace } from "../../../../types/telemetry";
import { MiddlewareNode } from "./MiddlewareNode";
import { Wire } from "../CircuitVisuals/Wire";
import { ShortCircuitLink } from "../CircuitVisuals/ShortCircuitLink";
import { usePipeline } from "../../hooks/usePipeline";

interface ResponsePipeProps {
  middlewares: string[];
  trace: Trace;
}

export const ResponsePipe = ({ middlewares, trace }: ResponsePipeProps) => {
  const { getRequestStep, getResponseStep, hasShortCircuit } = usePipeline(trace);
  return (
    <>
      {middlewares.map((middlewareName, index) => {
        const isLast = index === middlewares.length - 1;

        // This naturally looks at the correct array now! No more hardcoded arrays.
        const previousMiddleware = !isLast ? middlewares[index + 1] : undefined;

        const responseStep = getResponseStep(middlewareName);
        const previousResponseStep = previousMiddleware ? getResponseStep(previousMiddleware) : undefined;

        const isShortCircuit = hasShortCircuit(middlewareName);
        const isPreviousMiddlewareShortCircuit = previousMiddleware ? hasShortCircuit(previousMiddleware) : false;

        const isWireActive = !!responseStep && (!!previousResponseStep || isPreviousMiddlewareShortCircuit);
        const step = isShortCircuit ? getRequestStep(middlewareName) : responseStep;

        return (
          <React.Fragment key={`out-${middlewareName}`}>
            <MiddlewareNode middlewareName={middlewareName} step={step} />
            {!isLast &&
              (isShortCircuit ? (
                <ShortCircuitLink type="response" />
              ) : (
                <Wire isActive={isWireActive} flowDirection="response" />
              ))}
          </React.Fragment>
        );
      })}
    </>
  );
};
