import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";

export function AdminRouteError() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Unexpected error";

  const message = isRouteErrorResponse(error)
    ? "An admin page failed to load."
    : error instanceof Error
      ? error.message
      : "An unexpected error happened while rendering the admin area.";

  return (
    <div className="min-h-[60vh] p-6">
      <div className="mx-auto max-w-xl rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
        <div className="mb-4 flex justify-center text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-foreground">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
          <Button asChild>
            <Link to="/admin">Try again</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
