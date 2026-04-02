export interface Income {
  id: string;
  title: string;
  amount: number;
  category: string;
  incomeDate: string;
  notes?: string | null;
}

export interface IncomeInput {
  title: string;
  amount: number;
  category: string;
  incomeDate: string;
  notes?: string;
}

export interface IncomeListPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface IncomeListResponse {
  items: Income[];
  pagination: IncomeListPagination;
}
