import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, loading, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg border border-foreground bg-foreground p-3 text-center font-medium transition-all hover:bg-foreground/90 hover:scale-[1.01] active:scale-[0.98]",
        loading && "opacity-80 cursor-wait",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
        </div>
      ) : (
        <>
            <div className="flex items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                 <span className="text-parchment">{children}</span>
            </div>
            <div className="absolute top-0 left-0 z-10 flex h-full w-full -translate-x-12 items-center justify-center gap-2 text-parchment opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <span>{children}</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </>
      )}
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";