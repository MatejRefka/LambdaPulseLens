interface ShortCircuitLinkProps {
  type: "request" | "response";
}
export const ShortCircuitLink = ({ type }: ShortCircuitLinkProps) => {
  const glowLine = "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]";

  return (
    <div className="relative w-full h-5 shrink-0">
      {/*preserve the ghost wire*/}
      <div className="absolute inset-y-0 left-1/2 w-0.5 -ml-px bg-surface-40 opacity-30 z-0"></div>

      {type === "request" && (
        <>
          {/*vertical wire*/}
          <div className={`absolute top-0 bottom-1/2 left-1/2 w-0.5 -ml-px ${glowLine}`}></div>

          {/*horizontal wire*/}
          <div className={`absolute top-1/2 left-1/2 w-1/4 h-0.5 -mt-px ${glowLine}`}></div>

          {/*arrow right*/}
          <div
            className="absolute top-1/2 left-[75%] -mt-1 -ml-px w-0 h-0 
            border-y-4 border-y-transparent 
            border-l-[6px] border-l-orange-500 z-10"
          ></div>
        </>
      )}

      {type === "response" && (
        <>
          {/*horizontal wire*/}
          <div className={`absolute top-1/2 left-1/4 w-1/4 h-0.5 -mt-px ${glowLine}`}></div>

          {/*vertical wire*/}
          <div className={`absolute bottom-1/2 top-1.5 left-1/2 w-0.5 -ml-px ${glowLine}`}></div>

          {/*arrow up*/}
          <div
            className="absolute top-0 left-1/2 -ml-1 w-0 h-0 
            border-x-4 border-x-transparent 
            border-b-[6px] border-b-orange-500 z-10"
          ></div>
        </>
      )}
    </div>
  );
};
