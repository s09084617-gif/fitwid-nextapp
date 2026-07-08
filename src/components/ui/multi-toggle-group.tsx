import { cn } from "@/lib/utils";

interface MultiToggleGroupProps<T extends string> {
  label: string;
  values: T[];
  onChange: (values: T[]) => void;
  options: { value: T; label: string }[];
}

export function MultiToggleGroup<T extends string>({
  label,
  values,
  onChange,
  options,
}: MultiToggleGroupProps<T>) {
  function toggle(value: T) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition",
                active
                  ? "border-crimson bg-crimson/15 text-crimson"
                  : "border-border bg-surface text-muted hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
