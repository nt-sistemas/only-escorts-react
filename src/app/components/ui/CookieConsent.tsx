import { useEffect, useState } from "react";
import { Button } from "./button.js";

const CONSENT_COOKIE_NAME = "oei_cookie_consent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

type ConsentValue = "accepted" | "rejected";

function getCookie(name: string): string | null {
  const escapedName = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`),
  );

  return match && typeof match[1] === "string"
    ? decodeURIComponent(match[1])
    : null;
}

function setCookie(name: string, value: string): void {
  const isHttps = window.location.protocol === "https:";
  const secureAttribute = isHttps ? "; Secure" : "";

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secureAttribute}`;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentConsent = getCookie(CONSENT_COOKIE_NAME);
    setIsVisible(currentConsent !== "accepted" && currentConsent !== "rejected");
  }, []);

  const handleChoice = (choice: ConsentValue) => {
    setCookie(CONSENT_COOKIE_NAME, choice);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 p-5 text-foreground shadow-2xl backdrop-blur">
        <h2 className="text-base font-semibold sm:text-lg">Cookie Notice</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We use cookies to improve your experience, remember your preferences,
          and analyze traffic on the platform. Do you allow the use of cookies?
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleChoice("rejected")}
            className="border-border"
          >
            Reject
          </Button>
          <Button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Accept Cookies
          </Button>
        </div>
      </div>
    </div>
  );
}
