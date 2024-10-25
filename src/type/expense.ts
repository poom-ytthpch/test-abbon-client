import { User } from "./auth";

export type Category = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  categoryId: string;
  category: Category;
  notes: string;
  user: User;
  userId: string;
};

export type ExpensesInput = {
  userId: string;
  startDate: Date;
  endDate: Date;
  take: number;
  skip: number;
};

export type CategoriesInput = {
  take: number;
  skip: number;
};

export type UpdateExpenseInput = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  categoryId: string;
  notes: string;
};

export type ExpenseReport = {
  amount: number;
  category: string;
  userName: string;
  date: Date;
};
