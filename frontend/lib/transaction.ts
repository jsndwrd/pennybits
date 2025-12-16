import { ITransaction } from "./interface";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

export async function fetchTransactions(userId: string): Promise<ITransaction[]> {
  try {
    const res = await fetch(
      `${apiBaseUrl()}/api/transactions`,
      {
        headers: {
          "x-user-id": userId,
        },
      },
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
