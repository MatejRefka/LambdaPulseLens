import type { FlowDirection, ExecutionEvent } from "../../../../../types/telemetry";
import { cn } from "../../../../../utils/cn";

interface WireProps {
  isActive: boolean;
  direction?: FlowDirection;
  event?: ExecutionEvent;
  isFlex?: boolean;
  showArrow?: boolean;
}

export const Wire = ({
  isActive,
  direction = "downstream",
  event = "success",
  isFlex = false,
  showArrow = false
}: WireProps) => {
  const getWireColor = () => {
    if (!isActive) {
      return "bg-surface-40 opacity-30";
    }

    switch (event) {
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
    if (!isActive) {
      return direction === "downstream" ? "border-t-surface-40 opacity-30" : "border-b-surface-40 opacity-30";
    }
    switch (event) {
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
      <div className={cn("relative w-0.5", isFlex ? "h-full" : "h-4", getWireColor())}>
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
