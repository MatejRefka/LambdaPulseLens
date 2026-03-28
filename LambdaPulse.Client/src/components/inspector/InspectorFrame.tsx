import React from "react";
import type { Step, Trace } from "../../types/telemetry";
import { MIDDLEWARE_1_10, MIDDLEWARE_11_20, MIDDLEWARE_TERMINATION } from "../../utils/constants";
import { MiddlewareNode } from "./MiddlewareNode";
import { VerticalWire } from "./VerticalWire";
import { ShortCircuitLink } from "../dashboard/ShortCircuitLink";

interface InspectorFrameProps {
  trace: Trace;
}

//request/response pill
const WebContextPill = ({ type }: { type: "Request" | "Response" }) => (
  <div className="px-4 py-1.5 rounded-full bg-surface-20 border border-surface-40 text-[10px] uppercase font-bold text-surface-60 tracking-wider shadow-sm z-10">
    HTTP {type}
  </div>
);

//container for VerticalWire -> WebContextPill -> VerticalWire
const FlexWireContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center flex-1 min-h-0 w-full">{children}</div>
);

export const InspectorFrame = ({ trace }: InspectorFrameProps) => {
  const getRequestStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find(
      (s) => s.middleware === middlewareName && ["Enter", "ShortCircuit", "Exception"].includes(s.phase)
    );
  };

  const getResponseStep = (middlewareName: string): Step | undefined => {
    return trace.pipeline.find((s) => s.middleware === middlewareName && s.phase === "Exit");
  };

  const getFlowDirection = (step?: Step) => {
    if (!step) return "request";
    if (step.phase === "ShortCircuit" || step.phase === "Exception") return "error";
    return step.phase === "Enter" ? "request" : "response";
  };

  const hasShortCircuit = (middlewareName: string) => {
    const reqStep = getRequestStep(middlewareName);
    return reqStep?.phase === "ShortCircuit" || reqStep?.phase === "Exception";
  };

  return (
    //4 rows: flex wire -> pipeline -> termination node -> flex wire
    <div className="grid grid-cols-[1fr_1fr_4rem_1fr_1fr] grid-rows-[1fr_auto_auto_1fr] gap-x-6 w-full max-w-7xl mx-auto h-full">
      {/*row 1 col 1, flex wire with Http Request pill*/}
      <div className="row-start-1 col-start-1 flex flex-col h-full">
        <FlexWireContainer>
          <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_1_10[0])} flowDirection="request" isFlex />
          <WebContextPill type="Request" />
          <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_1_10[0])} flowDirection="request" isFlex showArrow />
        </FlexWireContainer>
      </div>

      {/*row 1 col 2, flex wire*/}
      <div className="row-start-1 col-start-2 flex flex-col h-full">
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_11_20[0])} flowDirection="request" isFlex showArrow />
      </div>

      {/*row 1 col 4, flex wire*/}
      <div className="row-start-1 col-start-4 flex flex-col h-full">
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_11_20[0])} flowDirection="response" isFlex showArrow />
      </div>

      {/*row 1 col 5, flex wire with Http Response pill*/}
      <div className="row-start-1 col-start-5 flex flex-col h-full">
        <FlexWireContainer>
          <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_1_10[0])} flowDirection="response" isFlex showArrow />
          <WebContextPill type="Response" />
          <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_1_10[0])} flowDirection="response" isFlex />
        </FlexWireContainer>
      </div>

      {/*row 2 col 1, request mw 1 to 10*/}
      <div className="row-start-2 col-start-1 flex flex-col">
        {MIDDLEWARE_1_10.map((middlewareName, index) => {
          const step = getRequestStep(middlewareName);
          const isLast = index === MIDDLEWARE_1_10.length - 1;
          const isShortCircuit = hasShortCircuit(middlewareName);
          return (
            <React.Fragment key={`in-col1-${middlewareName}`}>
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

        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_1_10[9])} flowDirection="request" />
      </div>

      {/*row 2 col 2, request mw 11 to 20*/}
      <div className="row-start-2 col-start-2 flex flex-col">
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_11_20[0])} flowDirection="request" isFlex />

        {MIDDLEWARE_11_20.map((middlewareName, index) => {
          const step = getRequestStep(middlewareName);
          const isLast = index === MIDDLEWARE_11_20.length - 1;
          const isShortCircuit = hasShortCircuit(middlewareName);
          return (
            <React.Fragment key={`in-col1-${middlewareName}`}>
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

        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_11_20[9])} flowDirection="request" />
      </div>

      {/*row 2 col 4, response mw 1-10*/}
      <div className="row-start-2 col-start-4 flex flex-col">
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_11_20[0])} flowDirection="response" isFlex />

        {MIDDLEWARE_11_20.map((middlewareName, index) => {
          const isLast = index === MIDDLEWARE_11_20.length - 1;
          const previousMiddleware = !isLast ? MIDDLEWARE_11_20[index + 1] : undefined;

          const responseStep = getResponseStep(middlewareName);
          const previousResponseStep = previousMiddleware ? getResponseStep(previousMiddleware) : undefined;

          const isShortCircuit = hasShortCircuit(middlewareName);
          const isPreviousMiddlewareShortCircuit = previousMiddleware ? hasShortCircuit(previousMiddleware) : false;

          const isWireActive = !!responseStep && (!!previousResponseStep || isPreviousMiddlewareShortCircuit);

          const step = isShortCircuit ? getRequestStep(middlewareName) : responseStep;

          return (
            <React.Fragment key={`out-col4-${middlewareName}`}>
              <MiddlewareNode middlewareName={middlewareName} step={step} />
              {!isLast &&
                (isShortCircuit ? (
                  <ShortCircuitLink type="response" />
                ) : (
                  <VerticalWire isActive={isWireActive} flowDirection="response" />
                ))}
            </React.Fragment>
          );
        })}
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_11_20[9])} flowDirection="response" />
      </div>

      {/*row 2 col 5, response mw 11-20*/}
      <div className="row-start-2 col-start-5  flex flex-col">
        {MIDDLEWARE_1_10.map((middlewareName, index) => {
          const isLast = index === MIDDLEWARE_1_10.length - 1;
          const previousMiddleware = !isLast ? MIDDLEWARE_11_20[index + 1] : undefined;

          const responseStep = getResponseStep(middlewareName);
          const previousResponseStep = previousMiddleware ? getResponseStep(previousMiddleware) : undefined;

          const isShortCircuit = hasShortCircuit(middlewareName);
          const isPreviousMiddlewareShortCircuit = previousMiddleware ? hasShortCircuit(previousMiddleware) : false;

          const isWireActive = !!responseStep && (!!previousResponseStep || isPreviousMiddlewareShortCircuit);

          const step = isShortCircuit ? getRequestStep(middlewareName) : responseStep;

          return (
            <React.Fragment key={`out-col5-${middlewareName}`}>
              <MiddlewareNode middlewareName={middlewareName} step={step} />
              {!isLast &&
                (isShortCircuit ? (
                  <ShortCircuitLink type="response" />
                ) : (
                  <VerticalWire isActive={isWireActive} flowDirection="response" />
                ))}
            </React.Fragment>
          );
        })}

        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_1_10[9])} flowDirection="response" showArrow />
      </div>

      {/*row 3 col 1, filler wire*/}
      <div className="row-start-3 col-start-1 h-full flex flex-col">
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_1_10[9])} flowDirection="request" isFlex />
      </div>

      {/*row 3 col 2 + 3 + 4, termination node*/}
      <div className="row-start-3 col-start-2 col-span-3 w-full flex items-center justify-center relative">
        <MiddlewareNode middlewareName={MIDDLEWARE_TERMINATION} step={getRequestStep(MIDDLEWARE_TERMINATION)} />
      </div>

      {/*row 3 col 5, filler wire*/}
      <div className="row-start-3 col-start-5  h-full flex flex-col">
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_1_10[9])} flowDirection="response" isFlex />
      </div>

      {/*row 4 col 1, flex wire*/}
      <div className="row-start-4 col-start-1  h-full flex flex-col">
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_1_10[9])} flowDirection="request" isFlex showArrow />
      </div>

      {/*row 4 col 5, flex wire*/}
      <div className="row-start-4 col-start-5 h-full flex flex-col">
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_1_10[9])} flowDirection="response" isFlex />
      </div>
    </div>
  );
};
