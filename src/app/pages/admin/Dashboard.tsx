"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Activity,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Database,
  Layers,
  Mail,
  Radio,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  User,
  UserX,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.js";
import { Badge } from "../../components/ui/badge.js";
import { getAdminDashboardData } from "../../services/admin.js";
import type { DashboardData, DashboardIconType } from "../../services/admin.js";

// Map backend icon names to Lucide icons
const ICON_MAP: Record<DashboardIconType, LucideIcon> = {
  user: User,
  users: Users,
  check_circle: CheckCircle2,
  "check-circle": CheckCircle2,
  clock: Clock3,
  x_circle: UserX,
  alert_triangle: AlertTriangle,
  dollar_sign: CircleDollarSign,
  mail: Mail,
  trending_up: TrendingUp,
  "trending-up": TrendingUp,
  trending_down: TrendingDown,
  "trending-down": TrendingDown,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  database: Database,
  activity: Activity,
  radio: Radio,
  layers: Layers,
};

// Map status colors to Tailwind classes
const STATUS_COLOR_MAP: Record<string, string> = {
  green: "text-green-500",
  red: "text-red-500",
  yellow: "text-yellow-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
  gray: "text-gray-500",
  slate: "text-slate-500",
};

const CARD_VARIANT_MAP: Record<string, string> = {
  default: "border-border/80 bg-card/90",
  success: "border-green-500/20 bg-green-500/5",
  info: "border-blue-500/20 bg-blue-500/5",
  warning: "border-yellow-500/20 bg-yellow-500/5",
  destructive: "border-red-500/20 bg-red-500/5",
  secondary: "border-blue-500/20 bg-blue-500/5",
};

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await getAdminDashboardData();
      setData(dashboardData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(message);
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the Only Escorts Intim platform
          </p>
        </div>
        <div className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the Only Escorts Intim platform
          </p>
        </div>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the Only Escorts Intim platform
          </p>
        </div>
      </div>
    );
  }

  const statusCards = data.userStatusCards ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the Only Escorts Intim platform
        </p>
      </div>

      {/* User Status Cards */}
      {statusCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statusCards.map((card) => {
            const Icon = ICON_MAP[card.icon] || AlertTriangle;
            const colorClass = STATUS_COLOR_MAP[card.statusColor];
            const variantClass = CARD_VARIANT_MAP[card.cardVariant];

            return (
              <Card
                key={card.status}
                className={`border-border/80 shadow-sm ${variantClass}`}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <Icon className={`h-8 w-8 ${colorClass}`} />
                    <Badge
                      variant="secondary"
                      className="bg-gray-500/10 text-gray-600"
                    >
                      {`Priority ${card.priority}`}
                    </Badge>
                  </div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    {card.status}
                  </p>
                  <p className="font-highlight text-2xl font-bold tracking-tight text-foreground">
                    {card.count}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/80 bg-card/90 shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No status cards were returned by API.
          </CardContent>
        </Card>
      )}

      {/* Metrics and Webhook Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Metrics Card */}
        <Card className="border-border/80 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Platform Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  Total Users
                </span>
                <span className="text-lg font-bold text-foreground">
                  {data.totalUsers}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  Validated Users
                </span>
                <span className="text-lg font-bold text-foreground">
                  {data.metrics.validatedUsers}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  Validated Percentage
                </span>
                <span className="text-lg font-bold text-green-500">
                  {data.metrics.validatedPercentage.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  New Users (24h)
                </span>
                <span className="text-lg font-bold text-foreground">
                  {data.metrics.newUsersLast24h}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  New Users (7d)
                </span>
                <span className="text-lg font-bold text-foreground">
                  {data.metrics.newUsersLast7d}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Verified Profiles
                </span>
                <span className="text-lg font-bold text-foreground">
                  {data.metrics.verifiedProfiles}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Block */}
        <Card className="border-border/80 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Webhook Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b border-border/70 pb-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  TOP EVENTS
                </p>
                {(data.webhook.topEventTypes ?? []).slice(0, 5).map((event) => (
                  <div
                    key={event.type}
                    className="mb-2 flex items-center justify-between last:mb-0"
                  >
                    <span className="text-sm text-foreground">
                      {event.type}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {event.total}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  Total Events
                </span>
                <Badge variant="secondary">{data.webhook.totalEvents}</Badge>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  Events (24h)
                </span>
                <Badge variant="secondary">{data.webhook.eventsLast24h}</Badge>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">
                  Events (7d)
                </span>
                <Badge variant="secondary">{data.webhook.eventsLast7d}</Badge>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-sm text-muted-foreground">Live/Test</span>
                <Badge variant="secondary">
                  {data.webhook.liveModeEvents}/{data.webhook.testModeEvents}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Unique Types
                </span>
                <Badge variant="secondary">
                  {data.webhook.uniqueEventTypes}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.dashboardCards.map((dashCard) => {
          const Icon = ICON_MAP[dashCard.icon] || AlertTriangle;
          const colorClass = STATUS_COLOR_MAP[dashCard.statusColor];
          const variantClass = CARD_VARIANT_MAP[dashCard.cardVariant];

          return (
            <Card
              key={dashCard.key}
              className={`border-border/80 shadow-sm ${variantClass}`}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${colorClass}`} />
                  {(dashCard.trendDirection !== "neutral" ||
                    dashCard.trendValue !== 0) && (
                    <Badge
                      variant={
                        dashCard.trendDirection === "up"
                          ? "default"
                          : dashCard.trendDirection === "down"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        dashCard.trendDirection === "up"
                          ? "border-green-500/20 bg-green-500/10 text-green-500"
                          : dashCard.trendDirection === "down"
                            ? "border-red-500/20 bg-red-500/10 text-red-500"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-500"
                      }
                    >
                      {dashCard.trendDirection === "up"
                        ? "+"
                        : dashCard.trendDirection === "down"
                          ? "-"
                          : ""}
                      {dashCard.trendValue}%
                    </Badge>
                  )}
                </div>
                <p className="mb-1 text-sm text-muted-foreground">
                  {dashCard.label}
                </p>
                <p className="font-highlight text-2xl font-bold tracking-tight text-foreground">
                  {dashCard.value}
                </p>
                {dashCard.subtitle && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {dashCard.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
