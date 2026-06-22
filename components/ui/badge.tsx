import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-primary",
        className
      )}
      {...props}
    />
  );
}
