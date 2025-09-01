import { ITransaction } from "./interface";

export async function fetchTransactions(): Promise<ITransaction[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CONNECTION_URL}/api/transactions`,
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch transactions");
    }

    const data: ITransaction[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
