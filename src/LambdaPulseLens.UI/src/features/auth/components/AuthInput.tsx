import React from "react";
import { cn } from "../../../utils/cn";

interface AuthInputProps extends React.ComponentPropsWithRef<"input"> {
  error?: string;
}

export const AuthInput = ({ className, error, ref, ...props }: AuthInputProps) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        {...props}
        className={cn(
          "w-full block px-4 py-2.5 bg-surface-30 rounded-xs border-transparent border focus:outline-none",
          error && "border-danger-10 border focus:ring-danger-10",
          className
        )}
      />
      {error && <p className="absolute top-full left-1 text-danger-10 text-[11px] text-left">{error}</p>}
    </div>
  );
};
