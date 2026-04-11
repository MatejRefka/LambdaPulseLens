import React from "react";
import type { Trace } from "../../../../types/telemetry";
import { MiddlewareNode } from "./MiddlewareNode";
import { Wire } from "../CircuitVisuals/Wire";
import { ShortCircuitLink } from "../CircuitVisuals/ShortCircuitLink";
import { usePipeline } from "../../hooks/usePipeline";

interface UpstreamPipeProps {
  middlewares: string[];
  trace: Trace;
  onLogClick: (activeLogItem: string) => void;
}

export const UpstreamPipe = ({ middlewares, trace, onLogClick }: UpstreamPipeProps) => {
  const { getDownstreamStep, getUpstreamStep, hasShortCircuit } = usePipeline(trace);
  return (
    <>
      {middlewares.map((middlewareName, index) => {
        const isLast = index === middlewares.length - 1;

        const previousMiddleware = !isLast ? middlewares[index + 1] : undefined;

        const upstreamStep = getUpstreamStep(middlewareName);
        const previousUpstreamStep = previousMiddleware ? getUpstreamStep(previousMiddleware) : undefined;

        const isShortCircuit = hasShortCircuit(middlewareName);
        const isPreviousMiddlewareShortCircuit = previousMiddleware ? hasShortCircuit(previousMiddleware) : false;

        const isWireActive = !!upstreamStep && (!!previousUpstreamStep || isPreviousMiddlewareShortCircuit);
        const step = isShortCircuit ? getDownstreamStep(middlewareName) : upstreamStep;

        return (
          <React.Fragment key={`out-${middlewareName}`}>
            <MiddlewareNode middlewareName={middlewareName} step={step} onLogClick={onLogClick} />
            {!isLast &&
              (isShortCircuit ? (
                <ShortCircuitLink direction="upstream" event={step?.event} />
              ) : (
                <Wire isActive={isWireActive} direction="upstream" event={step?.event} />
              ))}
          </React.Fragment>
        );
      })}
    </>
  );
};
