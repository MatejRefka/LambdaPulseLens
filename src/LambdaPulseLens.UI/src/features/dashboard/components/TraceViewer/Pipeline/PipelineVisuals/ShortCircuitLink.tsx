import type { FlowDirection, ExecutionEvent } from "../../../../../../types/telemetry";
import { cn } from "../../../../../../utils/cn";

interface ShortCircuitLinkProps {
  direction?: FlowDirection;
  event?: ExecutionEvent;
}
export const ShortCircuitLink = ({ direction, event = "short-circuit" }: ShortCircuitLinkProps) => {
  //termination node doesn't need a ShortCircuitLink
  if (!direction) {
    return null;
  }

  //nodes which succeeded do not need a ShortCircuitLink
  if (event === "success") {
    return null;
  }

  const wireColor = event === "error" ? "bg-danger-10" : "bg-warning-20";
  const arrowRightColor = event === "error" ? "border-l-danger-10" : "border-l-warning-20";
  const arrowTopColor = event === "error" ? "border-b-danger-10" : "border-b-warning-20";

  return (
    <div className="relative w-full h-5 shrink-0">
      {/*preserve the inactive wire*/}
      <div className="absolute inset-y-0 left-1/2 w-0.5 -ml-px bg-surface-40 opacity-30 z-0"></div>

      {direction === "downstream" && (
        <>
          {/*vertical wire*/}
          <div className={cn("absolute top-0 bottom-1/2 left-1/2 w-0.5 -ml-px", wireColor)}></div>

          {/*horizontal wire*/}
          <div className={cn("absolute top-1/2 left-1/2 w-1/4 h-0.5 -mt-px", wireColor)}></div>

          {/*arrow right*/}
          <div
            className={cn(
              "absolute top-1/2 left-[75%] -mt-1 -ml-px w-0 h-0 border-y-4 border-y-transparent border-l-[6px] z-10",
              arrowRightColor
            )}
          ></div>
        </>
      )}

      {direction === "upstream" && (
        <>
          {/*horizontal wire*/}
          <div className={cn("absolute top-1/2 left-1/4 w-1/4 h-0.5 -mt-px", wireColor)}></div>

          {/*vertical wire*/}
          <div className={cn("absolute bottom-1/2 top-1.5 left-1/2 w-0.5 -ml-px", wireColor)}></div>

          {/*arrow up*/}
          <div
            className={cn(
              "absolute top-0 left-1/2 -ml-1 w-0 h-0 border-x-4 border-x-transparent border-b-[6px] z-10",
              arrowTopColor
            )}
          ></div>
        </>
      )}
    </div>
  );
};
