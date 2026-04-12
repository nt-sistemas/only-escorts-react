import { apiGet } from "../lib/api.js";

export type PublicPlan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  freeTrialDays: number;
  features: string[];
  highlighted?: boolean;
  checkoutUrl?: string;
};

type ApiPlan = {
  id?: string | number;
  name?: string;
  description?: string | null;
  price?: number | string;
  freeTrialDays?: number;
  free_trial_days?: number;
  features?: string[];
  highlighted?: boolean;
  recommended?: boolean;
  checkoutUrl?: string;
  checkout_url?: string;
  checkoutLink?: string;
  checkout_link?: string;
  stripeCheckoutUrl?: string;
  stripe_checkout_url?: string;
};

type ApiResponse = ApiPlan[] | { data: ApiPlan[] };

function normalizePrice(value: number | string | undefined): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value
      .replace("€", "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return Number(normalized) || 0;
  }

  return 0;
}

function normalizePlan(plan: ApiPlan, index: number): PublicPlan {
  const features = Array.isArray(plan.features)
    ? plan.features.filter(
        (feature) => typeof feature === "string" && feature.trim().length > 0,
      )
    : [];

  const checkoutUrl =
    plan.checkoutUrl ||
    plan.checkout_url ||
    plan.checkoutLink ||
    plan.checkout_link ||
    plan.stripeCheckoutUrl ||
    plan.stripe_checkout_url;

  return {
    id: String(plan.id ?? index + 1),
    name: plan.name || "Unnamed plan",
    ...(plan.description ? { description: plan.description } : {}),
    price: normalizePrice(plan.price),
    freeTrialDays:
      typeof plan.freeTrialDays === "number"
        ? plan.freeTrialDays
        : typeof plan.free_trial_days === "number"
          ? plan.free_trial_days
          : 0,
    features,
    ...(plan.highlighted || plan.recommended ? { highlighted: true } : {}),
    ...(checkoutUrl ? { checkoutUrl } : {}),
  };
}

export async function listPublicPlans(): Promise<PublicPlan[]> {
  const response = await apiGet<ApiResponse>("/get-plans");
  const source = Array.isArray(response) ? response : response.data;

  return source.map(normalizePlan);
}
