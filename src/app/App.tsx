import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ThemeSelector } from "./theme/ThemeSelector";
import { CookieConsent } from "./components/ui/CookieConsent";
import { LoadingProvider } from "./context/LoadingContext";
import { GlobalLoader } from "./components/ui/GlobalLoader";

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <GlobalLoader />
        <RouterProvider router={router} />
        <CookieConsent />
        <ThemeSelector />
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
