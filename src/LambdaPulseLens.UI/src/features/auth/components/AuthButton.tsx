import React from "react";
import { cn } from "../../../utils/cn";

interface AuthButtonProps extends React.ComponentPropsWithRef<"button"> {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "icon";
}

export const AuthButton = ({ children, variant, className, ...props }: AuthButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        variant === "primary" &&
          "w-full py-2.5 rounded-4xl text-white cursor-pointer bg-brand-20 hover:bg-brand-10 transition-colors duration-200",
        variant === "secondary" &&
          "w-full py-2.5 rounded-4xl text-white cursor-pointer hover:bg-brand-10 transition-colors duration-200 border-white border-2",
        variant === "icon" &&
          "w-full h-full rounded-full flex items-center justify-center cursor-pointer border-2 border-surface-30",
        className //override
      )}
    >
      {children}
    </button>
  );
};
