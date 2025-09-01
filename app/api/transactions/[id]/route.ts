import { NextRequest, NextResponse } from "next/server.js";
import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../lib/db.js";
import Transaction from "../../model/Transaction.model.js";

connectDB();

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    // Find the transaction and verify ownership
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (transaction.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleteTransaction = await Transaction.findByIdAndDelete(id);
    return NextResponse.json(deleteTransaction);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
