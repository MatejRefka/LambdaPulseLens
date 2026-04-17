import type { Trace } from "../../../../../types/telemetry";
import { MIDDLEWARE_1_10, MIDDLEWARE_11_20, MIDDLEWARE_TERMINATION } from "../../../../../utils/constants";
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
  const { getDownstreamStep, getUpstreamStep } = usePipeline(trace);

  return (
    //4 rows: flex wire -> pipeline -> termination node -> flex wire
    <div className="grid grid-cols-[1fr_1fr_0rem_1fr_1fr] 2xl:grid-cols-[1fr_1fr_1rem_1fr_1fr] grid-rows-[1fr_auto_auto_1fr] gap-x-2 2xl:gap-x-6 w-full max-w-5xl mx-auto h-full">
      {/*row 1 col 1, flex wire with Http Request pill*/}
      <div className="row-start-1 col-start-1 flex flex-col h-full">
        <FlexWireContainer>
          <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_10[0])} direction="downstream" isFlex />
          <WebContextPill type="Request" />
          <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_10[0])} direction="downstream" isFlex showArrow />
        </FlexWireContainer>
      </div>

      {/*row 1 col 2, flex wire*/}
      <div className="row-start-1 col-start-2 flex flex-col h-full">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_11_20[0])} direction="downstream" isFlex showArrow />
      </div>

      {/*row 1 col 4, flex wire*/}
      <div className="row-start-1 col-start-4 flex flex-col h-full">
        <Wire isActive={!!getUpstreamStep(MIDDLEWARE_11_20[0])} direction="upstream" isFlex showArrow />
      </div>

      {/*row 1 col 5, flex wire with Http Response pill*/}
      <div className="row-start-1 col-start-5 flex flex-col h-full">
        <FlexWireContainer>
          <Wire isActive={!!getUpstreamStep(MIDDLEWARE_1_10[0])} direction="upstream" isFlex showArrow />
          <WebContextPill type="Response" />
          <Wire isActive={!!getUpstreamStep(MIDDLEWARE_1_10[0])} direction="upstream" isFlex />
        </FlexWireContainer>
      </div>

      {/*row 2 col 1, downstream pipeline -mw 1 to 10*/}
      <div className="row-start-2 col-start-1 flex flex-col">
        <DownstreamPipe middlewares={MIDDLEWARE_1_10} trace={trace} onLogClick={onLogClick} />
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_10[9])} direction="downstream" isFlex />
      </div>

      {/*row 2 col 2, downstream pipeline -mw 11 to 20*/}
      <div className="row-start-2 col-start-2 flex flex-col">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_11_20[0])} direction="downstream" isFlex />
        <DownstreamPipe middlewares={MIDDLEWARE_11_20} trace={trace} onLogClick={onLogClick} />
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_11_20[9])} direction="downstream" />
      </div>

      {/*row 2 col 4, upstream mw 1-10*/}
      <div className="row-start-2 col-start-4 flex flex-col">
        <Wire isActive={!!getUpstreamStep(MIDDLEWARE_11_20[0])} direction="upstream" isFlex />
        <UpstreamPipe middlewares={MIDDLEWARE_11_20} trace={trace} onLogClick={onLogClick} />
        <Wire isActive={!!getUpstreamStep(MIDDLEWARE_11_20[9])} direction="upstream" />
      </div>

      {/*row 2 col 5, upstream mw 11-20*/}
      <div className="row-start-2 col-start-5  flex flex-col">
        <UpstreamPipe middlewares={MIDDLEWARE_1_10} trace={trace} onLogClick={onLogClick} />
        <Wire isActive={!!getUpstreamStep(MIDDLEWARE_1_10[9])} direction="upstream" isFlex showArrow />
      </div>

      {/*row 3 col 1, filler wire*/}
      <div className="row-start-3 col-start-1 h-full flex flex-col">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_10[9])} direction="downstream" isFlex />
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
        <Wire isActive={!!getUpstreamStep(MIDDLEWARE_1_10[9])} direction="upstream" isFlex />
      </div>

      {/*row 4 col 1, flex wire*/}
      <div className="row-start-4 col-start-1  h-full flex flex-col">
        <Wire isActive={!!getDownstreamStep(MIDDLEWARE_1_10[9])} direction="downstream" isFlex showArrow />
      </div>

      {/*row 4 col 5, flex wire*/}
      <div className="row-start-4 col-start-5 h-full flex flex-col">
        <Wire isActive={!!getUpstreamStep(MIDDLEWARE_1_10[9])} direction="upstream" isFlex />
      </div>
    </div>
  );
};
