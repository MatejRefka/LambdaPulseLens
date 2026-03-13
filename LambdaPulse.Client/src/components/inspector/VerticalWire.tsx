interface VerticalWireProps {
  isActive: boolean;
  flowDirection: "request" | "response" | "error";
}

export const VerticalWire = ({ isActive, flowDirection }: VerticalWireProps) => {
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

  return (
    <div className="flex justify-center my-0.5">
      <div className={`w-0.5 h-4 transition-all duration-300 ${getWireStyle()}`}></div>
    </div>
  );
};
