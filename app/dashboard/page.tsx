"use client";
import TransactionTable from "../components/TransactionTable";
import Cashflow from "../components/Cashflow";
import { useEffect, useState } from "react";
import { ITransaction } from "../../lib/interface";
import { fetchTransactions } from "../../lib/transaction";

export default function Page() {
  const [transact, setTransact] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactions();
      setTransact(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONNECTION_URL}/api/transactions/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete transaction");
      }

      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete transaction",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Error!</h3>
            <div className="text-xs">{error}</div>
            <button
              className="btn btn-outline btn-sm mt-2"
              onClick={() => fetchData()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <Cashflow transact={transact} />
      </div>

      <div>
        <TransactionTable
          transact={transact}
          deleteTransaction={deleteTransaction}
          fetchData={fetchData}
        />
      </div>
    </div>
  );
}
