import React from "react";
import type { Step, Trace } from "../../types/telemetry";
import { MIDDLEWARE_1_10, MIDDLEWARE_11_20, MIDDLEWARE_TERMINATION } from "../../utils/constants";
import { MiddlewareNode } from "./MiddlewareNode";
import { VerticalWire } from "./VerticalWire";

interface InspectorFrameProps {
  trace: Trace;
}

export const InspectorFrame = ({ trace }: InspectorFrameProps) => {
  const getRequestStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find(
      (s) => s.middleware === middlewareName && ["Enter", "ShortCircuit", "Exception"].includes(s.phase)
    );
  };

  const getResponseStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find((s) => s.middleware === middlewareName && s.phase === "Exit");
  };

  // Helper to determine if a wire should show the red error state
  const getFlowDirection = (step?: Step) => {
    if (!step) return "request";
    if (step.phase === "ShortCircuit" || step.phase === "Exception") return "error";
    return step.phase === "Enter" ? "request" : "response";
  };

  return (
    <div className="grid grid-cols-5 gap-6 w-full max-w-7xl mx-auto py-4">
      {/*column 1, request mw 1 to 10*/}
      <div className="flex flex-col">
        {MIDDLEWARE_1_10.map((middlewareName, index) => {
          const step = getRequestStep(middlewareName);
          const isLast = index === MIDDLEWARE_1_10.length - 1;
          return (
            <React.Fragment key={`in-col1-${middlewareName}`}>
              <MiddlewareNode middlewareName={middlewareName} stepData={step} />
              {!isLast && <VerticalWire isActive={!!step} flowDirection={getFlowDirection(step)} />}
            </React.Fragment>
          );
        })}
      </div>

      {/*column 2, request mw 11 to 20*/}
      <div className="flex flex-col mt-12">
        {MIDDLEWARE_11_20.map((middlewareName, index) => {
          const step = getRequestStep(middlewareName);
          const isLast = index === MIDDLEWARE_11_20.length - 1;
          return (
            <React.Fragment key={`in-col2-${middlewareName}`}>
              <MiddlewareNode middlewareName={middlewareName} stepData={step} />
              {!isLast && <VerticalWire isActive={!!step} flowDirection={getFlowDirection(step)} />}
            </React.Fragment>
          );
        })}
      </div>

      {/*column 3, termination mw*/}
      <div className="flex flex-col items-center justify-end pb-12">
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_TERMINATION)} flowDirection="request" />
        <MiddlewareNode middlewareName={MIDDLEWARE_TERMINATION} stepData={getRequestStep(MIDDLEWARE_TERMINATION)} />
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_TERMINATION)} flowDirection="response" />
      </div>

      {/*column 4, response mw 1-10*/}
      <div className="flex flex-col mt-12">
        {MIDDLEWARE_11_20.map((middlewareName, index) => {
          const step = getResponseStep(middlewareName);
          const isLast = index === MIDDLEWARE_11_20.length - 1;
          const nextNodeBelow = !isLast ? getResponseStep(MIDDLEWARE_11_20[index + 1]) : undefined;
          const wireActive = !!step && !!nextNodeBelow;

          return (
            <React.Fragment key={`out-col4-${middlewareName}`}>
              <MiddlewareNode middlewareName={middlewareName} stepData={step} />
              {!isLast && <VerticalWire isActive={wireActive} flowDirection="response" />}
            </React.Fragment>
          );
        })}
      </div>

      {/*column 5, response mw 11-20*/}
      <div className="flex flex-col">
        {MIDDLEWARE_1_10.map((middlewareName, index) => {
          const step = getResponseStep(middlewareName);
          const isLast = index === MIDDLEWARE_1_10.length - 1;
          const nextNodeBelow = !isLast ? getResponseStep(MIDDLEWARE_1_10[index + 1]) : undefined;
          const wireActive = !!step && !!nextNodeBelow;

          return (
            <React.Fragment key={`out-col5-${middlewareName}`}>
              <MiddlewareNode middlewareName={middlewareName} stepData={step} />
              {!isLast && <VerticalWire isActive={wireActive} flowDirection="response" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
