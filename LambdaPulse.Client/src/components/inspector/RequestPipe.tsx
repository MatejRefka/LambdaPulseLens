import React from "react";
import type { Trace } from "../../types/telemetry";
import { MiddlewareNode } from "./MiddlewareNode";
import { VerticalWire } from "./VerticalWire";
import { ShortCircuitLink } from "../dashboard/ShortCircuitLink";
import { usePipeline } from "../../hooks/usePipeline";

interface RequestPipeProps {
  middlewares: string[];
  trace: Trace;
}

export const RequestPipe = ({ middlewares, trace }: RequestPipeProps) => {
  const { getRequestStep, getFlowDirection, hasShortCircuit } = usePipeline(trace);
  return (
    <>
      {middlewares.map((middlewareName, index) => {
        const step = getRequestStep(middlewareName);
        const isLast = index === middlewares.length - 1;
        const isShortCircuit = hasShortCircuit(middlewareName);

        return (
          <React.Fragment key={`in-${middlewareName}`}>
            <MiddlewareNode middlewareName={middlewareName} step={step} />
            {!isLast &&
              (isShortCircuit ? (
                <ShortCircuitLink type="request" />
              ) : (
                <VerticalWire isActive={!!step} flowDirection={getFlowDirection(step)} />
              ))}
          </React.Fragment>
        );
      })}
    </>
  );
};
