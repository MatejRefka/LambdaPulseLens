import type { Trace } from "../../../../../types/telemetry";
import { MIDDLEWARE_1_9, MIDDLEWARE_10_18, MIDDLEWARE_TERMINATION } from "../../../../../utils/constants";
import { MiddlewareNode } from "./PipelineParts/MiddlewareNode";
import { Wire } from "./PipelineVisuals/Wire";
import { DownstreamPipe } from "./PipelineParts/DownstreamPipe";
import { UpstreamPipe } from "./PipelineParts/UpstreamPipe";
import { usePipeline } from "../../../hooks/usePipeline";
import { WebContextPill } from "./PipelineVisuals/WebContextPill";
import { FlexWireContainer } from "../../Sidebar/FlexWireContainer";

interface PipelineLayoutProps {
  trace: Trace;
  onLogClick: (activeLogItem: string) => void;
}

export const PipelineLayout = ({ trace, onLogClick }: PipelineLayoutProps) => {
  const { getDownstreamStep, getUpstreamStep, hasShortCircuit, isErrorPropagationWire } = usePipeline(trace);
  const lastMiddleMiddleware = MIDDLEWARE_10_18[8];
  const lastMiddleMiddlewareShortCircuited = hasShortCircuit(lastMiddleMiddleware);
  const errorPropagatesBetweenColumns = isErrorPropagationWire(MIDDLEWARE_1_9[8]);

  return (
    //4 rows: flex wire -> pipeline -> termination node -> flex wire
    <div className="grid grid-cols-[1fr_1fr_0rem_1fr_1fr] 2xl:grid-cols-[1fr_1fr_1rem_1fr_1fr] grid-rows-[1fr_auto_auto_1fr] gap-x-2 2xl:gap-x-6 w-full max-w-5xl mx-auto h-full">
      {/*row 1 col 1, flex wire with Http Request pill*/}
      <div className="row-start-1 col-start-1 flex flex-col h-full">
        <FlexWireContainer>
          <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_9[0])} direction="downstream" isFlex />
          <WebContextPill type="Request" />
          <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_9[0])} direction="downstream" isFlex showArrow />
        </FlexWireContainer>
      </div>

      {/*row 1 col 2, flex wire*/}
      <div className="row-start-1 col-start-2 flex flex-col h-full">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_10_18[0])} direction="downstream" isFlex showArrow />
      </div>

      {/*row 1 col 4, flex wire*/}
      <div className="row-start-1 col-start-4 flex flex-col h-full">
        <Wire
          isActive={!!getUpstreamStep(MIDDLEWARE_10_18[0])}
          direction="upstream"
          isFlex
          showArrow
          isErrorPropagation={errorPropagatesBetweenColumns}
        />
      </div>

      {/*row 1 col 5, flex wire with Http Response pill*/}
      <div className="row-start-1 col-start-5 flex flex-col h-full">
        <FlexWireContainer>
          <Wire isActive={!!getUpstreamStep(MIDDLEWARE_1_9[0])} direction="upstream" isFlex showArrow />
          <WebContextPill type="Response" />
          <Wire isActive={!!getUpstreamStep(MIDDLEWARE_1_9[0])} direction="upstream" isFlex />
        </FlexWireContainer>
      </div>

      {/*row 2 col 1, downstream pipeline -mw 1 to 10*/}
      <div className="row-start-2 col-start-1 flex flex-col">
        <DownstreamPipe middlewares={MIDDLEWARE_1_9} trace={trace} onLogClick={onLogClick} />
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_9[8])} direction="downstream" isFlex />
      </div>

      {/*row 2 col 2, downstream pipeline -mw 11 to 20*/}
      <div className="row-start-2 col-start-2 flex flex-col">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_10_18[0])} direction="downstream" isFlex />
        <DownstreamPipe middlewares={MIDDLEWARE_10_18} trace={trace} onLogClick={onLogClick} />
        {lastMiddleMiddlewareShortCircuited ? (
          <div className="h-4" aria-hidden="true" />
        ) : (
          <Wire isActive={!!getDownstreamStep(lastMiddleMiddleware)} direction="downstream" />
        )}
      </div>

      {/*row 2 col 4, upstream mw 1-10*/}
      <div className="row-start-2 col-start-4 flex flex-col">
        <Wire
          isActive={!!getUpstreamStep(MIDDLEWARE_10_18[0])}
          direction="upstream"
          isFlex
          isErrorPropagation={errorPropagatesBetweenColumns}
        />
        <UpstreamPipe middlewares={MIDDLEWARE_10_18} trace={trace} onLogClick={onLogClick} />
        {lastMiddleMiddlewareShortCircuited ? (
          <div className="h-4" aria-hidden="true" />
        ) : (
          <Wire isActive={!!getUpstreamStep(lastMiddleMiddleware)} direction="upstream" />
        )}
      </div>

      {/*row 2 col 5, upstream mw 11-20*/}
      <div className="row-start-2 col-start-5  flex flex-col">
        <UpstreamPipe middlewares={MIDDLEWARE_1_9} trace={trace} onLogClick={onLogClick} />
        <Wire
          isActive={!!getUpstreamStep(MIDDLEWARE_1_9[8])}
          direction="upstream"
          isFlex
          showArrow
          isErrorPropagation={errorPropagatesBetweenColumns}
        />
      </div>

      {/*row 3 col 1, filler wire*/}
      <div className="row-start-3 col-start-1 h-full flex flex-col">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_9[8])} direction="downstream" isFlex />
      </div>

      {/*row 3 col 2 + 3 + 4, termination node*/}
      <div className="row-start-3 col-start-2 col-span-3 w-full flex items-center justify-center relative">
        <MiddlewareNode
          middlewareName={MIDDLEWARE_TERMINATION}
          step={getDownstreamStep(MIDDLEWARE_TERMINATION)}
          onLogClick={onLogClick}
        />
      </div>

      {/*row 3 col 5, filler wire*/}
      <div className="row-start-3 col-start-5  h-full flex flex-col">
        <Wire
          isActive={!!getUpstreamStep(MIDDLEWARE_1_9[8])}
          direction="upstream"
          isFlex
          isErrorPropagation={errorPropagatesBetweenColumns}
        />
      </div>

      {/*row 4 col 1, flex wire*/}
      <div className="row-start-4 col-start-1  h-full flex flex-col">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_9[8])} direction="downstream" isFlex showArrow />
      </div>

      {/*row 4 col 5, flex wire*/}
      <div className="row-start-4 col-start-5 h-full flex flex-col">
        <Wire
          isActive={!!getUpstreamStep(MIDDLEWARE_1_9[8])}
          direction="upstream"
          isFlex
          isErrorPropagation={errorPropagatesBetweenColumns}
        />
      </div>
    </div>
  );
};
