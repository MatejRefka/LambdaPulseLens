import React from "react";

interface FlexWireContainerProps {
  children: React.ReactNode;
}

export const FlexWireContainer = ({ children }: FlexWireContainerProps) => {
  return <div className="flex flex-col items-center flex-1 min-h-0 w-full">{children}</div>;
};
