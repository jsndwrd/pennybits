"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ITransaction } from "@/lib/interface";

interface TransactionTableProps {
  transact: ITransaction[];
  deleteTransaction: (id: string) => void;
  fetchData: () => void;
}

const categories = [
  "Consumption",
  "Education",
  "Personal",
  "Transportation",
  "Utilities",
] as const;

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

export default function TransactionTable({
  transact,
  deleteTransaction,
  fetchData,
}: TransactionTableProps) {
  const { userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [date, setDate] = useState(
    new Date(Date.now()).toISOString().split("T")[0],
  );
  const [type, setType] = useState<"0" | "1">("0");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Consumption");
  const [description, setDescription] = useState("");

  const [filterType, setFilterType] = useState<"all" | "0" | "1">("all");
  const [filterThisMonth, setFilterThisMonth] = useState(false);

  const filtered = useMemo(() => {
    const currentDate = new Date();

    return transact
      .filter((transaction) => {
        if (filterThisMonth) {
          const transactionDate = new Date(transaction.date);
          if (
            transactionDate.getMonth() !== currentDate.getMonth() ||
            transactionDate.getFullYear() !== currentDate.getFullYear()
          ) {
            return false;
          }
        }

        if (filterType === "all") return true;
        return String(transaction.type) === filterType;
      })
      .sort((b, a) => a.date.localeCompare(b.date));
  }, [filterThisMonth, filterType, transact]);

  const resetForm = () => {
    setDate(new Date(Date.now()).toISOString().split("T")[0]);
    setType("0");
    setAmount("");
    setCategory("Consumption");
    setDescription("");
  };

  const addTransaction = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (!userId) {
      toast.error("Unauthorized");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl()}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          date,
          type: Number(type),
          amount: numericAmount,
          category,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add transaction");
      }

      resetForm();
      toast.success("Transaction added");
      fetchData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add transaction",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 max-lg:flex-col max-lg:items-start">
        <CardTitle className="text-lg">Transactions</CardTitle>
        <div className="flex items-center gap-2 max-lg:flex-col max-lg:items-start">
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as typeof filterType)}
          >
            <SelectTrigger className="h-9 w-[170px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="0">Credit</SelectItem>
              <SelectItem value="1">Debit</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={filterThisMonth ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterThisMonth((v) => !v)}
          >
            This month
          </Button>
          <Button
            variant={showDelete ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDelete((v) => !v)}
          >
            Delete mode
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-muted/20 grid gap-4 rounded-lg border p-4 md:grid-cols-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="t-date">Date</Label>
            <Input
              id="t-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "0" | "1")}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Credit</SelectItem>
                <SelectItem value="1">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="t-amount">Amount</Label>
            <Input
              id="t-amount"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) =>
                setCategory(v as (typeof categories)[number])
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-5">
            <Label htmlFor="t-desc">Description</Label>
            <Input
              id="t-desc"
              placeholder="Optional notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="flex items-end md:col-span-1">
            <Button
              className="h-9 w-full"
              onClick={addTransaction}
              disabled={isSubmitting}
            >
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="max-h-[520px] overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[90px]">Type</TableHead>
                <TableHead className="w-[120px]">Amount</TableHead>
                <TableHead className="w-[160px]">Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">
                    {t.date.slice(0, 10)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.type === 0 ? "secondary" : "outline"}>
                      {t.type === 0 ? "Credit" : "Debit"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={
                      t.type === 1 ? "text-destructive" : "text-emerald-600"
                    }
                  >
                    ${Number(t.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.description}
                  </TableCell>
                  <TableCell className="text-right">
                    {showDelete && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteTransaction(t._id)}
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
