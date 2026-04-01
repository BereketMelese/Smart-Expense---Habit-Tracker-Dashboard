import React, { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Wallet, AlertCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import { expensesService } from "../../services/expensesService";
import type { Expense, ExpenseInput } from "../../types/expense";

const EMPTY_FORM: ExpenseInput = {
  title: "",
  amount: 0,
  category: "General",
  expenseDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ExpenseInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const monthlyTotal = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await expensesService.list();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadExpenses();
  }, []);

  const onChange =
    (key: keyof ExpenseInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [key]: key === "amount" ? Number(value) : value,
      }));
    };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingId) {
        const updated = await expensesService.update(editingId, form);
        setExpenses((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item)),
        );
      } else {
        const created = await expensesService.create(form);
        setExpenses((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      expenseDate: expense.expenseDate.slice(0, 10),
      notes: expense.notes ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await expensesService.remove(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    }
  };

  return (
    <section className="flex-1 p-5 md:p-8 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card
          className="max-w-none"
          title="Expenses"
          description="Track and manage your spending"
          icon={Wallet}
          color="blue"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-slate-500">Total Records</p>
              <p className="mt-1 text-2xl font-semibold">{expenses.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2">
              <p className="text-slate-500">Current Total</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                ${monthlyTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        {error && (
          <Card className="max-w-none" variant="outline" color="red">
            <div className="flex items-start gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </Card>
        )}

        <Card
          className="max-w-none"
          title={editingId ? "Edit Expense" : "Add Expense"}
          color="green"
        >
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              value={form.title}
              onChange={onChange("title")}
              placeholder="Title"
              className="border border-slate-300 rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={Number.isFinite(form.amount) ? form.amount : 0}
              onChange={onChange("amount")}
              placeholder="Amount"
              className="border border-slate-300 rounded-lg px-3 py-2"
              required
            />
            <input
              value={form.category}
              onChange={onChange("category")}
              placeholder="Category"
              className="border border-slate-300 rounded-lg px-3 py-2"
              required
            />
            <input
              type="date"
              value={form.expenseDate}
              onChange={onChange("expenseDate")}
              className="border border-slate-300 rounded-lg px-3 py-2"
              required
            />
            <textarea
              value={form.notes ?? ""}
              onChange={onChange("notes")}
              placeholder="Notes"
              className="border border-slate-300 rounded-lg px-3 py-2 md:col-span-2"
              rows={3}
            />
            <div className="md:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Card>

        <Card className="max-w-none" title="Expense Records" color="gray">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-14 bg-slate-100 border border-slate-200 rounded-lg animate-pulse" />
              <div className="h-14 bg-slate-100 border border-slate-200 rounded-lg animate-pulse" />
            </div>
          ) : expenses.length === 0 ? (
            <p className="text-sm text-slate-500">No expenses found yet.</p>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {expense.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {expense.category} •{" "}
                      {new Date(expense.expenseDate).toLocaleDateString()}
                    </p>
                    {expense.notes && (
                      <p className="text-xs text-slate-500 mt-1">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-800">
                      ${Number(expense.amount).toFixed(2)}
                    </p>
                    <button
                      onClick={() => startEdit(expense)}
                      className="p-2 rounded-lg hover:bg-slate-100"
                      aria-label="Edit expense"
                    >
                      <Pencil className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => void handleDelete(expense.id)}
                      className="p-2 rounded-lg hover:bg-red-50"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default Expenses;
