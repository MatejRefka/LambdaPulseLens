import React from "react";
import type { Trace } from "../../../../types/telemetry";
import { MiddlewareNode } from "./MiddlewareNode";
import { Wire } from "../CircuitVisuals/Wire";
import { ShortCircuitLink } from "../CircuitVisuals/ShortCircuitLink";
import { usePipeline } from "../../hooks/usePipeline";

interface DownstreamPipeProps {
  middlewares: string[];
  trace: Trace;
  onLogClick: (activeLogItem: string) => void;
}

export const DownstreamPipe = ({ middlewares, trace, onLogClick }: DownstreamPipeProps) => {
  const { getDownstreamStep, hasShortCircuit } = usePipeline(trace);
  return (
    <>
      {middlewares.map((middlewareName, index) => {
        const step = getDownstreamStep(middlewareName);
        const isLast = index === middlewares.length - 1;
        const isShortCircuit = hasShortCircuit(middlewareName);

        return (
          <React.Fragment key={`in-${middlewareName}`}>
            <MiddlewareNode middlewareName={middlewareName} step={step} onLogClick={onLogClick} />
            {!isLast &&
              (isShortCircuit ? (
                <ShortCircuitLink direction="downstream" event={step?.event} />
              ) : (
                <Wire isActive={!!step} direction="downstream" event={step?.event} />
              ))}
          </React.Fragment>
        );
      })}
    </>
  );
};
