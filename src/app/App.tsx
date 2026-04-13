import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ThemeSelector } from "./theme/ThemeSelector";
import { CookieConsent } from "./components/ui/CookieConsent";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <CookieConsent />
      <ThemeSelector />
    </ThemeProvider>
  );
}

export default App;
