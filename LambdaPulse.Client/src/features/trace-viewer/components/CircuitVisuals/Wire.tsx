interface WireProps {
  isActive: boolean;
  flowDirection: "request" | "response" | "error";
  isFlex?: boolean;
  showArrow?: boolean;
}

export const Wire = ({ isActive, flowDirection, isFlex = false, showArrow = false }: WireProps) => {
  const getWireStyle = () => {
    //ghost wire
    if (!isActive) return "bg-surface-40 opacity-30";

    //active wires
    switch (flowDirection) {
      case "request":
        return "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]";
      case "response":
        return "bg-success-30 shadow-[0_0_8px_rgba(74,222,128,0.8)]";
      case "error":
        return "bg-primary-50 shadow-[0_0_8px_rgba(239,68,68,0.8)]";
      default:
        return "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]";
    }
  };

  const getArrowStyle = () => {
    if (!isActive) {
      return flowDirection === "request" ? "border-t-surface-40 opacity-30" : "border-b-surface-40 opacity-30";
    }
    switch (flowDirection) {
      case "request":
        return "border-t-blue-400";
      case "response":
        return "border-b-success-30";
      case "error":
        return "border-t-primary-50";
      default:
        return "border-t-white";
    }
  };

  return (
    <div className={`flex justify-center ${isFlex ? "flex-1" : "my-0.5"}`}>
      <div className={`relative transition-all duration-300 w-0.5 ${isFlex ? "h-full" : "h-4"} ${getWireStyle()}`}>
        {/*arrow head pointing down*/}
        {showArrow && flowDirection === "request" && (
          <div
            className={`absolute bottom-0 left-1/2 -ml-1 w-0 h-0 
            border-x-4 border-x-transparent 
            border-t-[6px] ${getArrowStyle()}`}
          ></div>
        )}

        {/*arrow head pointing up*/}
        {showArrow && flowDirection === "response" && (
          <div
            className={`absolute top-0 left-1/2 -ml-1 w-0 h-0 
            border-x-4 border-x-transparent 
            border-b-[6px] ${getArrowStyle()}`}
          ></div>
        )}
      </div>
    </div>
  );
};
