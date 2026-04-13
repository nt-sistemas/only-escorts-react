import { useLoading } from "../../context/LoadingContext";

export function GlobalLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-primary/20"
    >
      <div className="h-full w-2/5 animate-loading-bar rounded-full bg-primary" />
    </div>
  );
}
