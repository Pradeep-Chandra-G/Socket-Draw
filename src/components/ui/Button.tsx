// src/components/ui/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 touch-manipulation select-none active:scale-[0.98]",
          {
            "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 hover:shadow-blue-600/40 focus-visible:ring-blue-600":
              variant === "primary",
            "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-400":
              variant === "secondary",
            "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20 focus-visible:ring-red-600":
              variant === "danger",
            "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus-visible:ring-gray-400":
              variant === "ghost",
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
    