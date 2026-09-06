import type { FlowDirection, ExecutionEvent } from "../../../../../../types/telemetry";
import { cn } from "../../../../../../utils/cn";

interface WireProps {
  isActive: boolean;
  direction?: FlowDirection;
  event?: ExecutionEvent;
  isFlex?: boolean;
  showArrow?: boolean;
  isErrorPropagation?: boolean;
}

export const Wire = ({
  isActive,
  direction = "downstream",
  event = "success",
  isFlex = false,
  showArrow = false,
  isErrorPropagation = false
}: WireProps) => {
  const isWireActive = isActive || isErrorPropagation;
  const wireEvent = isErrorPropagation ? "error" : event;

  const getWireColor = () => {
    if (!isWireActive) {
      return "bg-surface-40 opacity-30";
    }

    if (isErrorPropagation) {
      return "border-l border-dashed border-danger-10 opacity-50";
    }

    switch (wireEvent) {
      case "short-circuit":
        return "bg-warning-10";
      case "error":
        return "bg-danger-10";
      case "success":
      default:
        return "bg-surface-50";
    }
  };

  const getArrowColor = () => {
    if (!isWireActive) {
      return direction === "downstream" ? "border-t-surface-40 opacity-30" : "border-b-surface-40 opacity-30";
    }

    switch (wireEvent) {
      case "short-circuit":
        return direction === "downstream" ? "border-t-warning-20" : "border-b-warning-20";
      case "error":
        return direction === "downstream" ? "border-t-danger-10" : "border-b-danger-10";
      case "success":
      default:
        return direction === "downstream" ? "border-t-surface-50" : "border-b-surface-50";
    }
  };

  return (
    <div className={cn("flex justify-center", isFlex && "flex-1")}>
      <div
        className={cn(
          "relative",
          isErrorPropagation ? "w-0" : "w-0.5",
          isFlex ? "h-full" : "h-4",
          getWireColor()
        )}
      >
        {/*arrow head pointing downstream*/}
        {showArrow && direction === "downstream" && (
          <div
            className={cn(
              "absolute bottom-0 left-1/2 -ml-1 w-0 h-0 border-x-4 border-x-transparent border-t-[6px]",
              getArrowColor()
            )}
          ></div>
        )}

        {/*arrow head pointing upstream*/}
        {showArrow && direction === "upstream" && (
          <div
            className={cn(
              "absolute top-0 left-1/2 -ml-1 w-0 h-0 border-x-4 border-x-transparent border-b-[6px]",
              getArrowColor()
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
