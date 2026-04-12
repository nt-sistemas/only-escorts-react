import { useEffect, useState } from "react";
import { Search, Download, DollarSign, TrendingUp, Calendar, Check, Clock, X } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { getAdminBillingData } from "../../services/admin";

const BILLING_STATS = [
  {
    title: "Monthly Revenue",
    value: "€ 45.200,00",
    change: "+18%",
    icon: DollarSign,
  },
  {
    title: "Transactions",
    value: "342",
    change: "+12%",
    icon: TrendingUp,
  },
  {
    title: "Pending",
    value: "€ 8.400,00",
    change: "+5%",
    icon: Clock,
  },
  {
    title: "Commission",
    value: "€ 9.040,00",
    change: "+18%",
    icon: Calendar,
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "TRX-001234",
    model: "Isabela Santos",
    client: "Carlos M.",
    amount: "€ 500,00",
    commission: "€ 100,00",
    date: "08/03/2026",
    status: "Completed",
    method: "Credit Card",
  },
  {
    id: "TRX-001233",
    model: "Mariana Oliveira",
    client: "Roberto S.",
    amount: "€ 600,00",
    commission: "€ 120,00",
    date: "08/03/2026",
    status: "Completed",
    method: "PIX",
  },
  {
    id: "TRX-001232",
    model: "Rafael Costa",
    client: "Ana P.",
    amount: "€ 400,00",
    commission: "€ 80,00",
    date: "07/03/2026",
    status: "Pending",
    method: "Debit Card",
  },
  {
    id: "TRX-001231",
    model: "Juliana Rocha",
    client: "Pedro L.",
    amount: "€ 300,00",
    commission: "€ 60,00",
    date: "07/03/2026",
    status: "Completed",
    method: "PIX",
  },
  {
    id: "TRX-001230",
    model: "Bruno Silva",
    client: "Marcos T.",
    amount: "€ 350,00",
    commission: "€ 70,00",
    date: "06/03/2026",
    status: "Failed",
    method: "Credit Card",
  },
  {
    id: "TRX-001229",
    model: "Isabela Santos",
    client: "João K.",
    amount: "€ 500,00",
    commission: "€ 100,00",
    date: "06/03/2026",
    status: "Completed",
    method: "PIX",
  },
];

export function AdminBilling() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [billingStats, setBillingStats] = useState(BILLING_STATS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [billingNotice, setBillingNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBilling = async () => {
      try {
        const apiData = await getAdminBillingData();
        if (cancelled) {
          return;
        }

        if (apiData.stats?.length) {
          setBillingStats(
            apiData.stats.map((stat) => ({
              ...stat,
              icon:
                stat.title === "Monthly Revenue"
                  ? DollarSign
                  : stat.title === "Transactions"
                    ? TrendingUp
                    : stat.title === "Pending"
                      ? Clock
                      : Calendar,
            })),
          );
        }

        if (apiData.transactions?.length) {
          setTransactions(apiData.transactions);
        }

        setBillingNotice(null);
      } catch {
        if (!cancelled) {
          setBillingStats(BILLING_STATS);
          setTransactions(MOCK_TRANSACTIONS);
          setBillingNotice("Could not load billing from API. Showing local data.");
        }
      }
    };

    fetchBilling();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.model.toLowerCase().includes(search.toLowerCase()) ||
      transaction.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      Completed: {
        icon: Check,
        className: "bg-green-500/10 text-green-500 border-green-500/20",
      },
      Pending: {
        icon: Clock,
        className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      },
      Failed: {
        icon: X,
        className: "bg-red-500/10 text-red-500 border-red-500/20",
      },
    };

    const { icon: Icon, className } = config[status as keyof typeof config];

    return (
      <Badge variant="outline" className={`${className} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Billing Management
          </h1>
          <p className="text-neutral-400">
            Manage platform transactions and payments
          </p>
          {billingNotice && (
            <p className="mt-2 text-sm text-neutral-500">{billingNotice}</p>
          )}
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Download className="w-4 h-4 mr-2" />
            Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-pink-500" />
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-neutral-400 text-sm mb-1">{stat.title}</p>
                <p className="font-highlight text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions Table */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by ID, model, or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-800 border-neutral-700 hover:bg-neutral-800">
                  <TableHead className="text-neutral-300">ID</TableHead>
                  <TableHead className="text-neutral-300">Model</TableHead>
                  <TableHead className="text-neutral-300">Client</TableHead>
                  <TableHead className="text-neutral-300">Amount</TableHead>
                  <TableHead className="text-neutral-300">Commission</TableHead>
                  <TableHead className="text-neutral-300">Date</TableHead>
                  <TableHead className="text-neutral-300">Method</TableHead>
                  <TableHead className="text-neutral-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <TableCell className="font-mono text-white">
                      {transaction.id}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {transaction.model}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {transaction.client}
                    </TableCell>
                    <TableCell className="font-highlight font-semibold text-white tracking-tight">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="font-highlight text-pink-500 font-semibold tracking-tight">
                      {transaction.commission}
                    </TableCell>
                    <TableCell className="text-neutral-400">
                      {transaction.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-neutral-700 text-neutral-300"
                      >
                        {transaction.method}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-400">
                No transactions found with the selected filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
