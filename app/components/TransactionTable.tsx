"use client";
import { useState } from "react";
import { ITransaction } from "../../lib/interface";

interface TransactionTableProps {
  transact: ITransaction[];
  deleteTransaction: (id: string) => void;
  fetchData: () => void;
}

function TransactionTable({
  transact,
  deleteTransaction,
  fetchData,
}: TransactionTableProps) {
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(
    new Date(Date.now()).toISOString().split("T")[0],
  );
  const [type, setType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Consumption");
  const [description, setDescription] = useState(" ");

  const resetTransacts = () => {
    setDate(new Date(Date.now()).toISOString().split("T")[0]);
    setType(0);
    setAmount(0);
    setCategory("Consumption");
    setDescription(" ");
    setError(null);
  };

  const addTransaction = async () => {
    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONNECTION_URL}/api/transactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: date,
            type: type,
            amount: amount,
            category: category,
            description: description,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add transaction");
      }

      resetTransacts();
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add transaction",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // For table-filtering
  const [filterType, setFilterType] = useState(2);
  const [filterMonth, setFilterMonth] = useState(false);

  const filteredTransaction = transact.filter((transaction) => {
    if (filterMonth) {
      const transactionDate = new Date(transaction.date);
      const currentDate = new Date();
      if (
        transactionDate.getMonth() !== currentDate.getMonth() ||
        transactionDate.getFullYear() !== currentDate.getFullYear()
      ) {
        return false;
      }
    }

    if (filterType !== 2) {
      if (filterType === 0 && transaction.type !== 0) return false;
      if (filterType === 1 && transaction.type !== 1) return false;
    }

    return true;
  });

  filteredTransaction.sort((b, a) => a.date.localeCompare(b.date));

  return (
    <div className="rounded-2xl p-2">
      <h2 className="my-4 flex items-center justify-between gap-2 indent-4 text-xl">
        <span className="font-medium">All Transactions</span>
        <div className="flex items-center gap-2">
          <select
            className={`select select-xs w-full max-w-xs font-semibold ${filterType != 2 ? "bg-primary text-base-100" : ""} transition-all`}
            value={filterType}
            onChange={(e) => {
              setFilterType(parseInt(e.target.value));
            }}
          >
            <option value="2">All</option>
            <option value="0">Credit</option>
            <option value="1">Debit</option>
          </select>
          <button
            className={`btn ${filterMonth ? "btn-primary" : "btn-ghost"} btn-xs`}
            onClick={() => {
              setFilterMonth(!filterMonth);
            }}
          >
            This Month
          </button>
          <button
            className={`btn ${visible ? "btn-primary" : "btn-ghost"} btn-xs`}
            onClick={() => {
              setVisible(!visible);
            }}
          >
            Modify
          </button>
        </div>
      </h2>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error mb-4">
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
          <span>{error}</span>
        </div>
      )}

      <div className="h-[30rem] overflow-x-auto">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <thead>
            <tr className="*:font-normal">
              <th className="italic">Insert</th>
              <th>
                <input
                  type="date"
                  className="input input-xs w-full max-w-xs"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </th>
              <th>
                <select
                  className="select select-xs w-full max-w-xs"
                  value={type}
                  onChange={(e) => {
                    setType(parseInt(e.target.value));
                  }}
                >
                  <option value={0}>Credit</option>
                  <option value={1}>Debit</option>
                </select>
              </th>
              <th>
                <input
                  type="number"
                  placeholder="Amount"
                  min={0}
                  value={amount}
                  onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                  }}
                  className="input input-xs input-bordered w-full max-w-xs"
                />
              </th>
              <th>
                <select
                  className="select select-xs w-full max-w-xs"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option value={"Consumption"}>Consumption</option>
                  <option value={"Education"}>Education</option>
                  <option value={"Personal"}>Personal</option>
                  <option value={"Transportation"}>Transportation</option>
                  <option value={"Utilities"}>Utilities</option>
                </select>
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Description"
                  className="input input-xs input-bordered w-full max-w-xs"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </th>
              <th>
                <button
                  className="btn btn-square btn-ghost btn-sm"
                  onClick={() => {
                    addTransaction();
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransaction.map((e, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{e.date.slice(0, 10)}</td>
                <td className="font-medium">
                  {e.type === 0 ? "Credit" : "Debit"}
                </td>
                <td
                  className={`${
                    e.type === 1 ? "text-error" : "text-success"
                  } font-medium`}
                >
                  ${e.amount}
                </td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>
                  <button
                    className={`btn-base-100 btn btn-square btn-xs flex items-center justify-center ${visible ? "opacity-100" : "opacity-0"} transition-transform`}
                    onClick={() => {
                      deleteTransaction(e._id);
                    }}
                    disabled={!visible}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
