import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

type LoadingContextValue = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const startLoading = useCallback(() => setCount((c) => c + 1), []);
  const stopLoading = useCallback(
    () => setCount((c) => Math.max(0, c - 1)),
    [],
  );

  return (
    <LoadingContext.Provider
      value={{ isLoading: count > 0, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
