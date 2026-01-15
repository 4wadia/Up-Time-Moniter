import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: any;
  description: string;
  href?: string;
  cta?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        "bg-linen border border-black dark:border-dust-grey shadow-card",
        "transition-all duration-300 hover:shadow-soft cursor-default",
        className
      )}
      onClick={onClick}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        <Icon className="h-12 w-12 origin-left transform-gpu text-foreground transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-bold text-foreground">
          {name}
        </h3>
        <p className="max-w-lg text-foreground-muted">{description}</p>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        )}
      >
        <div className="pointer-events-auto">
          <a href={href} className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {cta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] dark:group-hover:bg-white/[.03]" />
    </div>
  );
};

export { BentoCard, BentoGrid };