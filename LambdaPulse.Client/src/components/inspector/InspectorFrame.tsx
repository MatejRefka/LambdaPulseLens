import type { Trace } from "../../types/telemetry";
import { MIDDLEWARE_1_10, MIDDLEWARE_11_20, MIDDLEWARE_TERMINATION } from "../../utils/constants";
import { MiddlewareNode } from "./MiddlewareNode";
import { VerticalWire } from "./VerticalWire";
import { RequestPipe } from "./RequestPipe";
import { ResponsePipe } from "./ResponsePipe";
import { usePipeline } from "../../hooks/usePipeline";
import { WebContextPill } from "../dashboard/WebContextPill";
import { FlexWireContainer } from "../dashboard/FlexWireContainer";

interface InspectorFrameProps {
  trace: Trace;
}

export const InspectorFrame = ({ trace }: InspectorFrameProps) => {
  const { getRequestStep, getResponseStep } = usePipeline(trace);

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

      {/*row 2 col 1, request pipeline -mw 1 to 10*/}
      <div className="row-start-2 col-start-1 flex flex-col">
        <RequestPipe middlewares={MIDDLEWARE_1_10} trace={trace} />
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_1_10[9])} flowDirection="request" />
      </div>

      {/*row 2 col 2, request pipeline -mw 11 to 20*/}
      <div className="row-start-2 col-start-2 flex flex-col">
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_11_20[0])} flowDirection="request" isFlex />
        <RequestPipe middlewares={MIDDLEWARE_11_20} trace={trace} />
        <VerticalWire isActive={!!getRequestStep(MIDDLEWARE_11_20[9])} flowDirection="request" />
      </div>

      {/*row 2 col 4, response mw 1-10*/}
      <div className="row-start-2 col-start-4 flex flex-col">
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_11_20[0])} flowDirection="response" isFlex />
        <ResponsePipe middlewares={MIDDLEWARE_11_20} trace={trace} />
        <VerticalWire isActive={!!getResponseStep(MIDDLEWARE_11_20[9])} flowDirection="response" />
      </div>

      {/*row 2 col 5, response mw 11-20*/}
      <div className="row-start-2 col-start-5  flex flex-col">
        <ResponsePipe middlewares={MIDDLEWARE_1_10} trace={trace} />
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
