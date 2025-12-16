import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardClient from "./DashboardClient";
import type { ITransaction } from "@/lib/interface";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const res = await fetch(`${apiBaseUrl()}/api/transactions`, {
    headers: {
      "x-user-id": userId,
    },
    cache: "no-store",
  });

  const initialTransactions: ITransaction[] = res.ok ? await res.json() : [];

  return <DashboardClient initialTransactions={initialTransactions} />;
}

