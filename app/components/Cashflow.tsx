"use client";
import { useEffect, useMemo, useState } from "react";
import { ITransaction } from "../../lib/interface";

interface CashflowProps {
  transact: ITransaction[];
}

export default function Cashflow({ transact }: CashflowProps) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [categoryFlow, setCategoryFlow] = useState<number[]>([]);

  const categoryName = useMemo(
    () => [
      "Consumption",
      "Education",
      "Personal",
      "Transportation",
      "Utilities",
    ],
    [],
  );

  useEffect(() => {
    const countCashflow = async () => {
      let income = 0;
      let expense = 0;
      let balance = 0;

      const categoryCash = [0, 0, 0, 0, 0];

      const currentDate = new Date();
      for (let i = 0; i < transact.length; i++) {
        balance += transact[i].amount;
        const transactionDate = new Date(transact[i].date);
        if (
          currentDate.getMonth() == transactionDate.getMonth() &&
          currentDate.getFullYear() == transactionDate.getFullYear()
        ) {
          if (transact[i].type == 0) {
            income += transact[i].amount;
          } else {
            expense += transact[i].amount;
          }
        }
      }

      for (let i = 0; i < transact.length; i++) {
        for (let j = 0; j < categoryName.length; j++) {
          const transactionDate = new Date(transact[i].date);
          if (
            currentDate.getMonth() == transactionDate.getMonth() &&
            currentDate.getFullYear() == transactionDate.getFullYear()
          ) {
            if (
              transact[i].category == categoryName[j] &&
              transact[i].type == 1
            ) {
              categoryCash[j] += transact[i].amount;
            }
          }
        }
      }

      setCategoryFlow(categoryCash);
      setBalance(balance);
      setIncome(income);
      setExpense(expense);
    };
    countCashflow();
  }, [transact, categoryName]);

  return (
    <div>
      <div className="h-full gap-4 md:flex">
        <div className="flex flex-col gap-4 *:border-b *:shadow-sm *:transition-all hover:*:shadow-md">
          <div className="stats">
            <div className="stat">
              <div className="stat-figure text-blue-600">
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
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div className="stat-title">Balance</div>
              <div className="stat-value font-bold">${balance.toFixed(2)}</div>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="stat-figure text-success">
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
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              </div>
              <div className="stat-title">Income</div>
              <div className="stat-value font-bold">${income.toFixed(2)}</div>
              <div className="stat-desc italic">This month</div>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="stat-figure text-error">
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
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              </div>
              <div className="stat-title">Expenses</div>
              <div className="stat-value font-bold">${expense.toFixed(2)}</div>
              <div className="stat-desc italic">This month</div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-2xl border-b px-6 py-4 shadow-sm transition-all *:flex-1 hover:shadow-md max-md:mt-4">
          <h2 className="text-xl font-semibold">Expenses Category</h2>
          {categoryName.map((e, i) => (
            <div key={i} className="flex items-center gap-2">
              <h2 className="font-medium">{e}</h2>
              <progress
                className={`progress progress-error w-full`}
                value={categoryFlow[i] ? categoryFlow[i] : 0}
                max={expense}
              ></progress>
              {categoryFlow[i] != 0 && <span>${categoryFlow[i]}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
