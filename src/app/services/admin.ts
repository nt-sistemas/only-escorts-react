import { apiDelete, apiGet, apiPost, apiPut } from "../lib/api.js";

// Dashboard types matching backend API
export type DashboardCardVariant =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "destructive"
  | "secondary";
export type DashboardStatusColor =
  | "green"
  | "red"
  | "yellow"
  | "blue"
  | "purple"
  | "gray"
  | "slate";
export type DashboardIconType =
  | "user"
  | "users"
  | "check_circle"
  | "check-circle"
  | "clock"
  | "x_circle"
  | "alert_triangle"
  | "dollar_sign"
  | "mail"
  | "trending_up"
  | "trending-up"
  | "trending_down"
  | "trending-down"
  | "shield-check"
  | "badge-check"
  | "database"
  | "activity"
  | "radio"
  | "layers";

export type UserStatusCard = {
  count: number;
  status:
    | "ACTIVE"
    | "PROCESSING"
    | "INACTIVE"
    | "CANCELED"
    | "PAST_DUE"
    | "UNPAID"
    | "VALIDATED";
  statusColor: DashboardStatusColor;
  cardVariant: DashboardCardVariant;
  icon: DashboardIconType;
  priority: number;
};

export type DashboardMetrics = {
  validatedUsers: number;
  validatedPercentage: number;
  newUsersLast24h: number;
  newUsersLast7d: number;
  verifiedProfiles: number;
};

export type WebhookTopEvent = {
  type: string;
  total: number;
};

export type WebhookLastEvent = {
  receivedAt: string;
  type: string;
  eventId: string;
};

export type WebhookBlock = {
  totalEvents: number;
  eventsLast24h: number;
  eventsLast7d: number;
  liveModeEvents: number;
  testModeEvents: number;
  unknownModeEvents: number;
  uniqueEventTypes: number;
  topEventTypes: WebhookTopEvent[];
  lastEvent?: WebhookLastEvent;
};

export type DashboardCard = {
  key: string;
  label: string;
  value: string | number;
  subtitle?: string;
  cardVariant: DashboardCardVariant;
  statusColor: DashboardStatusColor;
  icon: DashboardIconType;
  priority: number;
  trendDirection: "up" | "down" | "neutral";
  trendValue: number;
};

export type DashboardData = {
  totalUsers: number;
  userStatusCards: UserStatusCard[];
  byStatus: Record<string, number>;
  metrics: DashboardMetrics;
  webhook: WebhookBlock;
  dashboardCards: DashboardCard[];
};

type ApiDashboardStatusCard = {
  status?: string;
  total?: number;
};

type ApiDashboardMetrics = {
  validatedUsers?: number;
  validatedPercentage?: number;
  newUsersLast24h?: number;
  newUsersLast7d?: number;
  verifiedProfiles?: number;
};

type ApiDashboardWebhookTopEvent = {
  type?: string;
  total?: number;
};

type ApiDashboardWebhook = {
  totalEvents?: number;
  eventsLast24h?: number;
  eventsLast7d?: number;
  liveModeEvents?: number;
  testModeEvents?: number;
  unknownModeEvents?: number;
  uniqueEventTypes?: number;
  topEventTypes?: ApiDashboardWebhookTopEvent[];
  lastEvent?: {
    receivedAt?: string;
    type?: string;
    eventId?: string;
  };
};

type ApiDashboardCard = {
  key?: string;
  label?: string;
  value?: string | number;
  subtitle?: string;
  trendDirection?: "up" | "down" | "neutral";
  trendValue?: number;
  cardVariant?: DashboardCardVariant;
  statusColor?: DashboardStatusColor;
  priority?: number;
  icon?: DashboardIconType;
};

type ApiDashboardCardsBlock = {
  userCards?: ApiDashboardCard[];
  webhookCards?: ApiDashboardCard[];
};

type ApiDashboardResponse = {
  totalUsers?: number;
  cards?: ApiDashboardStatusCard[];
  byStatus?: Record<string, number>;
  metrics?: ApiDashboardMetrics;
  webhook?: ApiDashboardWebhook;
  dashboardCards?: ApiDashboardCardsBlock;
};

// Legacy types for backward compatibility
export type DashboardStat = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
};

export type RecentActivity = {
  id: number;
  user: string;
  action: string;
  time: string;
  type: "success" | "info" | "warning";
};

export type TopModel = {
  id: number;
  name: string;
  revenue: string;
  views: string;
};

export type BillingStat = {
  title: string;
  value: string;
  change: string;
};

export type BillingTransaction = {
  id: string;
  model: string;
  client: string;
  amount: string;
  commission: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  method: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  planId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiUser = {
  id?: string;
  name?: string | null;
  email?: string;
  role?: string;
  status?: string;
  planId?: string | null;
  plan_id?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

export type UserPayload = {
  email: string;
  password?: string;
  name?: string;
  role?: string;
  status?: string;
  planId?: string;
};

export type AdminPlan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stripePriceId: string;
  stripeProductId: string;
  freeTrialDays: number;
  createdAt?: string;
  updatedAt?: string;
};

type ApiPlan = {
  id?: string;
  name?: string;
  description?: string;
  price?: number | string;
  stripePriceId?: string;
  stripeProductId?: string;
  freeTrialDays?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PlanPayload = {
  name: string;
  description?: string;
  price: number;
  stripePriceId?: string;
  stripeProductId?: string;
  freeTrialDays: number;
};

export type AdminCategory = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminGender = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiNamedEntity = {
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NamedEntityPayload = {
  name: string;
};

type ApiDataResponse<T> = T | { data: T };

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

function normalizePlan(plan: ApiPlan, index: number): AdminPlan {
  return {
    id: plan.id || String(index + 1),
    name: plan.name || "Unnamed plan",
    ...(plan.description ? { description: plan.description } : {}),
    price: normalizePrice(plan.price),
    stripePriceId: plan.stripePriceId || "",
    stripeProductId: plan.stripeProductId || "",
    freeTrialDays:
      typeof plan.freeTrialDays === "number" ? plan.freeTrialDays : 0,
    ...(plan.createdAt ? { createdAt: plan.createdAt } : {}),
    ...(plan.updatedAt ? { updatedAt: plan.updatedAt } : {}),
  };
}

function normalizeUser(user: ApiUser, index: number): AdminUser {
  const normalizedPlanId = user.planId || user.plan_id;
  const normalizedCreatedAt = user.createdAt || user.created_at;
  const normalizedUpdatedAt = user.updatedAt || user.updated_at;

  return {
    id: user.id || String(index + 1),
    name: user.name || "Unnamed user",
    email: user.email || "",
    role: user.role || "USER",
    status: user.status || "PROCESSING",
    ...(normalizedPlanId ? { planId: normalizedPlanId } : {}),
    ...(normalizedCreatedAt ? { createdAt: normalizedCreatedAt } : {}),
    ...(normalizedUpdatedAt ? { updatedAt: normalizedUpdatedAt } : {}),
  };
}

function normalizeNamedEntity(
  entity: ApiNamedEntity,
  index: number,
): AdminCategory {
  return {
    id: entity.id || String(index + 1),
    name: entity.name || "Unnamed",
    ...(entity.createdAt ? { createdAt: entity.createdAt } : {}),
    ...(entity.updatedAt ? { updatedAt: entity.updatedAt } : {}),
  };
}

export async function getAdminDashboardData(): Promise<DashboardData> {
  const response =
    await apiGet<ApiDataResponse<ApiDashboardResponse>>("/admin/dashboard");
  const source = "data" in response ? response.data : response;

  const userStatusCards: UserStatusCard[] = Array.isArray(source.cards)
    ? source.cards
        .map((card, index) => {
          const status =
            typeof card.status === "string" ? card.status.toUpperCase() : "";

          if (
            ![
              "ACTIVE",
              "VALIDATED",
              "PROCESSING",
              "INACTIVE",
              "CANCELED",
              "PAST_DUE",
              "UNPAID",
            ].includes(status)
          ) {
            return null;
          }

          const styleByStatus: Record<
            UserStatusCard["status"],
            {
              statusColor: DashboardStatusColor;
              cardVariant: DashboardCardVariant;
              icon: DashboardIconType;
            }
          > = {
            ACTIVE: {
              statusColor: "green",
              cardVariant: "success",
              icon: "check-circle",
            },
            VALIDATED: {
              statusColor: "blue",
              cardVariant: "info",
              icon: "shield-check",
            },
            PROCESSING: {
              statusColor: "yellow",
              cardVariant: "warning",
              icon: "clock",
            },
            INACTIVE: {
              statusColor: "gray",
              cardVariant: "default",
              icon: "x_circle",
            },
            CANCELED: {
              statusColor: "red",
              cardVariant: "destructive",
              icon: "x_circle",
            },
            PAST_DUE: {
              statusColor: "purple",
              cardVariant: "warning",
              icon: "alert_triangle",
            },
            UNPAID: {
              statusColor: "red",
              cardVariant: "destructive",
              icon: "alert_triangle",
            },
          };

          const typedStatus = status as UserStatusCard["status"];

          return {
            status: typedStatus,
            count: typeof card.total === "number" ? card.total : 0,
            priority: index + 1,
            ...styleByStatus[typedStatus],
          };
        })
        .filter((card): card is UserStatusCard => Boolean(card))
    : [];

  const userCards = Array.isArray(source.dashboardCards?.userCards)
    ? source.dashboardCards.userCards
    : [];
  const webhookCards = Array.isArray(source.dashboardCards?.webhookCards)
    ? source.dashboardCards.webhookCards
    : [];

  const dashboardCards: DashboardCard[] = [...userCards, ...webhookCards]
    .map((card, index) => ({
      key: typeof card.key === "string" ? card.key : `card-${index + 1}`,
      label: typeof card.label === "string" ? card.label : "Metric",
      value:
        typeof card.value === "number" || typeof card.value === "string"
          ? card.value
          : 0,
      subtitle: typeof card.subtitle === "string" ? card.subtitle : undefined,
      trendDirection: (card.trendDirection === "up" ||
      card.trendDirection === "down" ||
      card.trendDirection === "neutral"
        ? card.trendDirection
        : "neutral") as DashboardCard["trendDirection"],
      trendValue: typeof card.trendValue === "number" ? card.trendValue : 0,
      cardVariant: card.cardVariant ?? "default",
      statusColor: card.statusColor ?? "gray",
      priority: typeof card.priority === "number" ? card.priority : index + 1,
      icon: card.icon ?? "user",
    }))
    .sort((a, b) => a.priority - b.priority);

  return {
    totalUsers: typeof source.totalUsers === "number" ? source.totalUsers : 0,
    userStatusCards,
    byStatus: source.byStatus ?? {},
    metrics: {
      validatedUsers:
        typeof source.metrics?.validatedUsers === "number"
          ? source.metrics.validatedUsers
          : 0,
      validatedPercentage:
        typeof source.metrics?.validatedPercentage === "number"
          ? source.metrics.validatedPercentage
          : 0,
      newUsersLast24h:
        typeof source.metrics?.newUsersLast24h === "number"
          ? source.metrics.newUsersLast24h
          : 0,
      newUsersLast7d:
        typeof source.metrics?.newUsersLast7d === "number"
          ? source.metrics.newUsersLast7d
          : 0,
      verifiedProfiles:
        typeof source.metrics?.verifiedProfiles === "number"
          ? source.metrics.verifiedProfiles
          : 0,
    },
    webhook: {
      totalEvents:
        typeof source.webhook?.totalEvents === "number"
          ? source.webhook.totalEvents
          : 0,
      eventsLast24h:
        typeof source.webhook?.eventsLast24h === "number"
          ? source.webhook.eventsLast24h
          : 0,
      eventsLast7d:
        typeof source.webhook?.eventsLast7d === "number"
          ? source.webhook.eventsLast7d
          : 0,
      liveModeEvents:
        typeof source.webhook?.liveModeEvents === "number"
          ? source.webhook.liveModeEvents
          : 0,
      testModeEvents:
        typeof source.webhook?.testModeEvents === "number"
          ? source.webhook.testModeEvents
          : 0,
      unknownModeEvents:
        typeof source.webhook?.unknownModeEvents === "number"
          ? source.webhook.unknownModeEvents
          : 0,
      uniqueEventTypes:
        typeof source.webhook?.uniqueEventTypes === "number"
          ? source.webhook.uniqueEventTypes
          : 0,
      topEventTypes: Array.isArray(source.webhook?.topEventTypes)
        ? source.webhook.topEventTypes
            .map((event) => ({
              type: typeof event.type === "string" ? event.type : "unknown",
              total: typeof event.total === "number" ? event.total : 0,
            }))
            .filter((event) => event.type.length > 0)
        : [],
      ...(source.webhook?.lastEvent?.receivedAt &&
      source.webhook?.lastEvent?.type &&
      source.webhook?.lastEvent?.eventId
        ? {
            lastEvent: {
              receivedAt: source.webhook.lastEvent.receivedAt,
              type: source.webhook.lastEvent.type,
              eventId: source.webhook.lastEvent.eventId,
            },
          }
        : {}),
    },
    dashboardCards,
  };
}

export async function getAdminBillingData() {
  const response = await apiGet<
    ApiDataResponse<{
      stats: BillingStat[];
      transactions: BillingTransaction[];
    }>
  >("/admin/billing");
  return "data" in response ? response.data : response;
}

export async function getAdminUsersData(): Promise<AdminUser[]> {
  const response = await apiGet<ApiDataResponse<ApiUser[]>>("/admin/user");
  const source = "data" in response ? response.data : response;

  return source.map(normalizeUser);
}

export async function createAdminUser(
  payload: UserPayload,
): Promise<AdminUser> {
  const response = await apiPost<ApiDataResponse<ApiUser>, UserPayload>(
    "/admin/user",
    payload,
  );
  const source = "data" in response ? response.data : response;

  return normalizeUser(source, 0);
}

export async function updateAdminUser(
  userId: string,
  payload: UserPayload,
): Promise<AdminUser> {
  const response = await apiPut<ApiDataResponse<ApiUser>, UserPayload>(
    `/admin/user/${userId}`,
    payload,
  );
  const source = "data" in response ? response.data : response;

  return normalizeUser(source, 0);
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await apiDelete(`/admin/user/${userId}`);
}

export async function getAdminPlansData(): Promise<AdminPlan[]> {
  const response = await apiGet<ApiDataResponse<ApiPlan[]>>("/admin/plan");
  const source = "data" in response ? response.data : response;

  return source.map(normalizePlan);
}

export async function createAdminPlan(
  payload: PlanPayload,
): Promise<AdminPlan> {
  const response = await apiPost<ApiDataResponse<ApiPlan>, PlanPayload>(
    "/admin/plan",
    payload,
  );
  const source = "data" in response ? response.data : response;

  return normalizePlan(source, 0);
}

export async function updateAdminPlan(
  planId: string,
  payload: PlanPayload,
): Promise<AdminPlan> {
  const response = await apiPut<ApiDataResponse<ApiPlan>, PlanPayload>(
    `/admin/plan/${planId}`,
    payload,
  );
  const source = "data" in response ? response.data : response;

  return normalizePlan(source, 0);
}

export async function deleteAdminPlan(planId: string): Promise<void> {
  await apiDelete(`/admin/plan/${planId}`);
}

export async function getAdminCategoriesData(): Promise<AdminCategory[]> {
  const response =
    await apiGet<ApiDataResponse<ApiNamedEntity[]>>("/admin/category");
  const source = "data" in response ? response.data : response;

  return source.map(normalizeNamedEntity);
}

export async function createAdminCategory(
  payload: NamedEntityPayload,
): Promise<AdminCategory> {
  const response = await apiPost<
    ApiDataResponse<ApiNamedEntity>,
    NamedEntityPayload
  >("/admin/category", payload);
  const source = "data" in response ? response.data : response;

  return normalizeNamedEntity(source, 0);
}

export async function updateAdminCategory(
  categoryId: string,
  payload: NamedEntityPayload,
): Promise<AdminCategory> {
  const response = await apiPut<
    ApiDataResponse<ApiNamedEntity>,
    NamedEntityPayload
  >(`/admin/category/${categoryId}`, payload);
  const source = "data" in response ? response.data : response;

  return normalizeNamedEntity(source, 0);
}

export async function deleteAdminCategory(categoryId: string): Promise<void> {
  await apiDelete(`/admin/category/${categoryId}`);
}

export async function getAdminGendersData(): Promise<AdminGender[]> {
  const response =
    await apiGet<ApiDataResponse<ApiNamedEntity[]>>("/admin/gender");
  const source = "data" in response ? response.data : response;

  return source.map(normalizeNamedEntity);
}

export async function createAdminGender(
  payload: NamedEntityPayload,
): Promise<AdminGender> {
  const response = await apiPost<
    ApiDataResponse<ApiNamedEntity>,
    NamedEntityPayload
  >("/admin/gender", payload);
  const source = "data" in response ? response.data : response;

  return normalizeNamedEntity(source, 0);
}

export async function updateAdminGender(
  genderId: string,
  payload: NamedEntityPayload,
): Promise<AdminGender> {
  const response = await apiPut<
    ApiDataResponse<ApiNamedEntity>,
    NamedEntityPayload
  >(`/admin/gender/${genderId}`, payload);
  const source = "data" in response ? response.data : response;

  return normalizeNamedEntity(source, 0);
}

export async function deleteAdminGender(genderId: string): Promise<void> {
  await apiDelete(`/admin/gender/${genderId}`);
}
