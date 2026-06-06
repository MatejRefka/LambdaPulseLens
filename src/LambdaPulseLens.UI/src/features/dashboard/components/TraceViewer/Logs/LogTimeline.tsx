import type { Step } from "../../../../../types/telemetry";
import { LogItem } from "./LogItem";

interface LogTimelineProps {
  pipeline: Step[];
  activeLogItem: string | null;
}

export const LogTimeline = ({ pipeline, activeLogItem }: LogTimelineProps) => {
  return (
    <div className="h-full w-full pr-1 overflow-y-auto overflow-x-hidden scrollbar">
      <div className="flex flex-col gap-1">
        {pipeline.map((step, index) => {
          const isActive = activeLogItem === `${step.middleware}-${step.direction}`;
          return <LogItem key={`${step.middleware}-${step.direction}-${index}`} step={step} isActive={isActive} />;
        })}
      </div>
    </div>
  );
};
