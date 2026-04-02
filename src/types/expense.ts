export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  notes?: string | null;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  notes?: string;
}

export interface ExpenseListPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ExpenseListResponse {
  items: Expense[];
  pagination: ExpenseListPagination;
}
