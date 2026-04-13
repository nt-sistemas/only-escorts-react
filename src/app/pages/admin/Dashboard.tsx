import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  type LucideIcon,
  UserX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.js";
import { Badge } from "../../components/ui/badge.js";

type StatusStat = {
  title:
    | "ACTIVE"
    | "PROCESSING"
    | "INACTIVE"
    | "CANCELED"
    | "PAST_DUE"
    | "UNPAID";
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
};

const USER_STATUS_TOTALS: StatusStat[] = [
  {
    title: "ACTIVE",
    value: "842",
    change: "+15",
    icon: CheckCircle2,
    positive: true,
  },
  {
    title: "PROCESSING",
    value: "126",
    change: "+4",
    icon: Clock3,
    positive: true,
  },
  {
    title: "INACTIVE",
    value: "98",
    change: "-3",
    icon: UserX,
    positive: false,
  },
  {
    title: "CANCELED",
    value: "53",
    change: "-1",
    icon: Ban,
    positive: false,
  },
  {
    title: "PAST_DUE",
    value: "71",
    change: "+6",
    icon: AlertTriangle,
    positive: false,
  },
  {
    title: "UNPAID",
    value: "44",
    change: "+2",
    icon: CircleDollarSign,
    positive: false,
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    user: "Isabela Santos",
    action: "New model registration",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    user: "Carlos M.",
    action: "Payment processed - € 500,00",
    time: "3 hours ago",
    type: "success",
  },
  {
    id: 3,
    user: "Mariana Oliveira",
    action: "Profile updated",
    time: "5 hours ago",
    type: "info",
  },
  {
    id: 4,
    user: "Rafael Costa",
    action: "Report received",
    time: "6 hours ago",
    type: "warning",
  },
  {
    id: 5,
    user: "Juliana Rocha",
    action: "Photos added to gallery",
    time: "8 hours ago",
    type: "info",
  },
];

const TOP_MODELS = [
  {
    id: 1,
    name: "Isabela Santos",
    revenue: "€ 15.400,00",
    views: "2.3K",
  },
  {
    id: 2,
    name: "Mariana Oliveira",
    revenue: "€ 12.800,00",
    views: "1.9K",
  },
  {
    id: 3,
    name: "Juliana Rocha",
    revenue: "€ 10.200,00",
    views: "1.5K",
  },
  {
    id: 4,
    name: "Rafael Costa",
    revenue: "€ 9.600,00",
    views: "1.2K",
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the Only Escorts Intim platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {USER_STATUS_TOTALS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-border/80 bg-card/90 shadow-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-8 w-8 text-pink-500" />
                  <Badge
                    variant={stat.positive ? "default" : "destructive"}
                    className={
                      stat.positive
                        ? "border-green-500/20 bg-green-500/10 text-green-500"
                        : "border-red-500/20 bg-red-500/10 text-red-500"
                    }
                  >
                    {stat.change}
                  </Badge>
                </div>
                <p className="mb-1 text-sm text-muted-foreground">
                  Status {stat.title}
                </p>
                <p className="font-highlight text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/80 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between border-b border-border/70 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="mb-1 font-medium text-foreground">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant="outline"
                      className={
                        activity.type === "success"
                          ? "border-green-500/20 text-green-500"
                          : activity.type === "warning"
                            ? "border-yellow-500/20 text-yellow-500"
                            : "border-border text-muted-foreground"
                      }
                    >
                      {activity.type}
                    </Badge>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Top Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TOP_MODELS.map((model, index) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between border-b border-border/70 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {model.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {model.views} views
                      </p>
                    </div>
                  </div>
                  <p className="font-highlight font-bold tracking-tight text-pink-500">
                    {model.revenue}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
