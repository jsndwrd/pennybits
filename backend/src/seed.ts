import dotenv from "dotenv";
import { connectDb } from "./db.js";
import { Transaction } from "./models/Transaction.js";

dotenv.config();

type SeedArgs = {
  count: number;
  userId: string;
  clear: boolean;
};

function parseArgs(argv: string[]): SeedArgs {
  const defaultCount = 1000;
  const countArg = argv.find((a) => a.startsWith("--count="));
  const userIdArg = argv.find((a) => a.startsWith("--userId="));
  const clear = argv.includes("--clear") || process.env.SEED_CLEAR === "true";

  const count = countArg ? Number(countArg.split("=", 2)[1]) : defaultCount;
  const userId =
    (userIdArg ? userIdArg.split("=", 2)[1] : undefined) ||
    process.env.SEED_USER_ID ||
    "seed-user";

  if (!Number.isFinite(count) || count <= 0) {
    throw new Error(`Invalid --count (got: ${String(count)})`);
  }

  if (!userId) {
    throw new Error("Missing --userId or SEED_USER_ID");
  }

  return { count: Math.floor(count), userId, clear };
}

function randomInt(minInclusive: number, maxInclusive: number) {
  return (
    minInclusive + Math.floor(Math.random() * (maxInclusive - minInclusive + 1))
  );
}

function randomChoice<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function randomDateBetween(from: Date, to: Date) {
  const fromMs = from.getTime();
  const toMs = to.getTime();
  return new Date(fromMs + Math.random() * (toMs - fromMs));
}

function monthsAgo(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

const categories = [
  "Utilities",
  "Personal",
  "Consumption",
  "Transportation",
  "Education",
] as const;

const expenseDescriptions = [
  "Groceries",
  "Coffee",
  "Fuel",
  "Subscription",
  "Dinner",
  "Ride",
  "Books",
  "Internet bill",
  "Phone bill",
  "Streaming",
  "Snacks",
  "Parking",
  "Gift",
  "Supplies",
  "Repair",
];

const incomeDescriptions = [
  "Salary",
  "Bonus",
  "Freelance",
  "Refund",
  "Cashback",
  "Side gig",
  "Interest",
];

function generateAmount(type: 0 | 1) {
  if (type === 0) {
    const base = randomInt(800, 6000);
    const cents = randomInt(0, 99) / 100;
    return Math.round((base + cents) * 100) / 100;
  }

  const base = randomInt(5, 450);
  const cents = randomInt(0, 99) / 100;
  return Math.round((base + cents) * 100) / 100;
}

async function main() {
  const { count, userId, clear } = parseArgs(process.argv.slice(2));

  await connectDb();

  const start = monthsAgo(6);
  const end = new Date();

  if (clear) {
    await Transaction.deleteMany({
      userId,
      date: { $gte: start, $lte: end },
    });
  }

  const docs = Array.from({ length: count }).map(() => {
    const type: 0 | 1 = Math.random() < 0.22 ? 0 : 1;
    const date = randomDateBetween(start, end);
    const category = randomChoice(categories);
    const description =
      type === 0
        ? randomChoice(incomeDescriptions)
        : randomChoice(expenseDescriptions);

    return {
      userId,
      date,
      type,
      amount: generateAmount(type),
      category,
      description,
    };
  });

  await Transaction.insertMany(docs, { ordered: false });

  console.log(
    `Seeded ${docs.length} transactions for userId=${userId} covering last 6 months${clear ? " (cleared first)" : ""}.`,
  );

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

