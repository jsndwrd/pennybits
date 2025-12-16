"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { m } from "framer-motion";
import { ListOrdered, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionTable from "@/app/components/TransactionTable";
import type { ITransaction } from "@/lib/interface";
import { fetchTransactions } from "@/lib/transaction";

const chartPalette = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
] as const;

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

type RangeKey = "all" | "month";

function isInThisMonth(date: string) {
  const d = new Date(date);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function DashboardClient({
  initialTransactions,
}: {
  initialTransactions: ITransaction[];
}) {
  const { userId } = useAuth();
  const [range, setRange] = useState<RangeKey>("month");
  const [transactions, setTransactions] = useState<ITransaction[]>(
    initialTransactions,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (range === "all") return transactions;
    return transactions.filter((t) => isInThisMonth(t.date));
  }, [range, transactions]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === 0) income += Number(t.amount);
      else expense += Number(t.amount);
    }
    return {
      income,
      expense,
      net: income - expense,
      count: filtered.length,
    };
  }, [filtered]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of filtered) {
      if (t.type !== 1) continue;
      map.set(t.category, (map.get(t.category) || 0) + Number(t.amount));
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const dailyNetData = useMemo(() => {
    const days = 30;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const map = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      map.set(d.toISOString().slice(0, 10), 0);
    }

    for (const t of filtered) {
      const key = new Date(t.date).toISOString().slice(0, 10);
      if (!map.has(key)) continue;
      const delta = Number(t.amount) * (t.type === 0 ? 1 : -1);
      map.set(key, (map.get(key) || 0) + delta);
    }

    return Array.from(map.entries()).map(([date, net]) => ({
      date,
      label: format(new Date(date), "MMM d"),
      net,
    }));
  }, [filtered]);

  const monthlyBars = useMemo(() => {
    const months = 6;
    const now = new Date();
    const keys: string[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const map = new Map<string, { month: string; income: number; expense: number }>();
    for (const key of keys) {
      const d = new Date(`${key}-01T00:00:00`);
      map.set(key, { month: format(d, "MMM"), income: 0, expense: 0 });
    }

    for (const t of filtered) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) continue;
      const row = map.get(key)!;
      if (t.type === 0) row.income += Number(t.amount);
      else row.expense += Number(t.amount);
    }

    return keys.map((k) => map.get(k)!);
  }, [filtered]);

  const refresh = async () => {
    try {
      setIsRefreshing(true);
      if (!userId) throw new Error("Unauthorized");
      const data = await fetchTransactions(userId);
      setTransactions(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch transactions",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      if (!userId) throw new Error("Unauthorized");
      const res = await fetch(`${apiBaseUrl()}/api/transactions/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete transaction");
      }
      await refresh();
      toast.success("Transaction deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete transaction",
      );
    }
  };

  return (
    <m.div
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            A quick view of cashflow and spending patterns.
          </p>
        </div>

        <Tabs value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <TabsList>
            <TabsTrigger value="month">This month</TabsTrigger>
            <TabsTrigger value="all">All time</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isRefreshing ? (
          <>
            <Skeleton className="h-[104px]" />
            <Skeleton className="h-[104px]" />
            <Skeleton className="h-[104px]" />
            <Skeleton className="h-[104px]" />
          </>
        ) : (
          <>
            <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--chart-2))" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Income
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-md bg-[hsl(var(--chart-2))]/15 text-[hsl(var(--chart-2))]">
                    <TrendingUp className="size-4" />
                  </div>
                  <div className="text-2xl font-semibold">{currency(summary.income)}</div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[hsl(var(--chart-2))]/35 bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))]"
                >
                  Credit
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--chart-3))" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-md bg-[hsl(var(--chart-3))]/15 text-[hsl(var(--chart-3))]">
                    <TrendingDown className="size-4" />
                  </div>
                  <div className="text-2xl font-semibold">{currency(summary.expense)}</div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[hsl(var(--chart-3))]/35 bg-[hsl(var(--chart-3))]/10 text-[hsl(var(--chart-3))]"
                >
                  Debit
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--chart-6))" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-md bg-[hsl(var(--chart-6))]/15 text-[hsl(var(--chart-6))]">
                    <Wallet className="size-4" />
                  </div>
                  <div className="text-2xl font-semibold">{currency(summary.net)}</div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[hsl(var(--chart-6))]/35 bg-[hsl(var(--chart-6))]/10 text-[hsl(var(--chart-6))]"
                >
                  Net
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--chart-5))" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-md bg-[hsl(var(--chart-5))]/15 text-[hsl(var(--chart-5))]">
                    <ListOrdered className="size-4" />
                  </div>
                  <div className="text-2xl font-semibold">{summary.count}</div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[hsl(var(--chart-5))]/35 bg-[hsl(var(--chart-5))]/10 text-[hsl(var(--chart-5))]"
                >
                  Total
                </Badge>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Net (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isRefreshing ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyNetData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value) => currency(Number(value ?? 0))}
                    labelFormatter={(label) => label}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="hsl(var(--chart-6))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spending by category</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isRefreshing ? (
              <Skeleton className="h-full w-full" />
            ) : categoryData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No expense data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(v) => currency(Number(v ?? 0))}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartPalette[index % chartPalette.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income vs expenses (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          {isRefreshing ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBars} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v) => currency(Number(v ?? 0))}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <TransactionTable
        transact={filtered}
        deleteTransaction={deleteTransaction}
        fetchData={refresh}
      />
    </m.div>
  );
}

