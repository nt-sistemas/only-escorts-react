import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.js";
import { Badge } from "../components/ui/badge.js";
import { Button } from "../components/ui/button.js";
import { listPublicPlans, type PublicPlan } from "../services/plans.js";

const FALLBACK_PLANS: PublicPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For profiles starting to grow visibility on the platform.",
    price: 79,
    freeTrialDays: 0,
    features: [
      "Public profile with up to 12 photos",
      "Email support during business hours",
      "Basic visibility badge",
      "Unlimited profile updates",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "More visibility and tools to grow faster.",
    price: 149,
    freeTrialDays: 7,
    highlighted: true,
    features: [
      "Everything in Starter",
      "Priority placement in search results",
      "Stories with boosted delivery",
      "Priority chat support",
      "Weekly performance report",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    description: "Advanced plan for maximum conversion and presence.",
    price: 279,
    freeTrialDays: 14,
    features: [
      "Everything in Premium",
      "Permanent VIP positioning",
      "Dedicated account manager",
      "Advanced audience insights",
      "Custom seasonal campaigns",
    ],
  },
];

function priceFormatter(value: number) {
  const formattedNumber = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `€ ${formattedNumber}`;
}

export function SubscriptionPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PublicPlan[]>(FALLBACK_PLANS);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const resolveCheckoutUrl = (value: string) => {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
    return value.startsWith("/") ? `${base}${value}` : `${base}/${value}`;
  };

  const handleSubscribe = (plan: PublicPlan) => {
    if (plan.checkoutUrl) {
      window.location.href = resolveCheckoutUrl(plan.checkoutUrl);
      return;
    }

    navigate(`/register?planId=${encodeURIComponent(plan.id)}`);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const apiPlans = await listPublicPlans();
        if (cancelled) {
          return;
        }

        if (apiPlans.length > 0) {
          setPlans(apiPlans);
          setNotice(null);
          return;
        }

        setPlans(FALLBACK_PLANS);
        setNotice("No plans found in API. Showing local plans.");
      } catch {
        if (!cancelled) {
          setPlans(FALLBACK_PLANS);
          setNotice("Could not load plans from API. Showing local plans.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPlans();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayPlans = useMemo(() => {
    if (plans.some((plan) => plan.highlighted)) {
      return plans;
    }

    const sorted = [...plans].sort((a, b) => a.price - b.price);
    if (sorted.length >= 2) {
      const middlePlan = sorted[Math.floor(sorted.length / 2)];
      if (!middlePlan) {
        return plans;
      }

      return plans.map((plan) =>
        plan.id === middlePlan.id ? { ...plan, highlighted: true } : plan,
      );
    }

    return plans;
  }, [plans]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-foreground">
      <section className="max-w-4xl mx-auto text-center mb-10">
        <Badge className="mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Subscriptions
        </Badge>
        <h1 className="text-3xl md:text-5xl text-foreground mb-3">Choose the right plan for your profile</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Compare features and pick the visibility level that fits your goals.
        </p>
        {notice && <p className="mt-3 text-sm text-muted-foreground">{notice}</p>}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {isLoading && (
          <p className="col-span-full text-center text-sm text-muted-foreground">Loading plans...</p>
        )}

        {displayPlans.map((plan) => {
          return (
            <Card
              key={plan.id}
              className={`relative border-border bg-card ${plan.highlighted ? "ring-2 ring-primary" : ""}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 right-4">Most popular</Badge>
              )}

              <CardHeader>
                <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description || "Subscription plan"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <p className="text-3xl font-semibold text-foreground">{priceFormatter(plan.price)}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                  {plan.freeTrialDays > 0 && (
                    <Badge variant="outline" className="mt-3 border-primary/20 text-primary">
                      {plan.freeTrialDays} free trial days
                    </Badge>
                  )}
                </div>

                {plan.features.length > 0 ? (
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-sm text-muted-foreground">
                    Plan ID: {plan.id}
                  </div>
                )}

                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan)}
                >
                  {plan.freeTrialDays > 0 ? "Start free trial" : `Subscribe to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
