import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-[-0.01em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground shadow-[0_10px_24px_rgba(31,92,74,0.22)] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(31,92,74,0.28)] hover:brightness-110",
        secondary:
          "bg-card/90 text-foreground border border-border shadow-[var(--shadow-soft)] backdrop-blur hover:-translate-y-0.5 hover:bg-card",
        ghost: "hover:bg-muted/80 text-foreground",
        outline:
          "border border-border bg-transparent hover:bg-card/80 text-foreground backdrop-blur",
        danger: "bg-danger-soft text-danger hover:brightness-95",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
