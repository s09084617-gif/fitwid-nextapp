import { cn } from "@/lib/utils";

interface ToggleGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

export function ToggleGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: ToggleGroupProps<T>) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="grid grid-flow-col auto-cols-fr gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-3 py-2.5 text-sm font-medium transition",
              value === opt.value
                ? "border-crimson bg-crimson/15 text-crimson"
                : "border-border bg-surface text-muted hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
