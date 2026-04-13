import { Moon, Sun } from "lucide-react";
import { cn } from "../components/ui/utils";
import { useTheme } from "./ThemeProvider";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "dark", label: "Dark", icon: Moon },
    { value: "light", label: "Light", icon: Sun },
  ] as const;

  return (
    <div className="fixed right-4 top-20 z-50 rounded-full border border-border/80 bg-background/88 p-1 shadow-lg shadow-black/10 backdrop-blur supports-[backdrop-filter]:bg-background/72 md:top-4">
      <div
        className="flex items-center gap-1"
        role="tablist"
        aria-label="Theme selector"
      >
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
