export interface ITransaction {
  _id: string;
  userId: string;
  date: string;
  type: number;
  amount: number;
  category: string;
  description: string;
}
