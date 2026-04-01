import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Target,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import { habitsService } from "../../services/habitsService";
import type { Habit, HabitInput, HabitTargetType } from "../../types/habit";

const EMPTY_FORM: HabitInput = {
  name: "",
  targetType: "DAILY",
  targetCount: 1,
  color: "#0ea5e9",
};

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HabitInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadHabits = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await habitsService.list();
      setHabits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadHabits();
  }, []);

  const onChangeText =
    (key: keyof HabitInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [key]:
          key === "targetCount"
            ? Number(value)
            : key === "targetType"
              ? (value as HabitTargetType)
              : value,
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
        const updated = await habitsService.update(editingId, form);
        setHabits((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item)),
        );
      } else {
        const created = await habitsService.create(form);
        setHabits((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save habit");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setForm({
      name: habit.name,
      targetType: habit.targetType,
      targetCount: habit.targetCount,
      color: habit.color ?? "#0ea5e9",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await habitsService.remove(id);
      setHabits((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete habit");
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      await habitsService.addCheckIn(id);
      await loadHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check in habit");
    }
  };

  return (
    <section className="flex-1 p-5 md:p-8 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card
          className="max-w-none"
          title="Habits"
          description="Build consistency through daily check-ins"
          icon={Target}
          color="indigo"
        >
          <p className="text-sm text-slate-600">
            Total active habits:{" "}
            <span className="font-semibold">{habits.length}</span>
          </p>
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
          title={editingId ? "Edit Habit" : "Create Habit"}
          color="green"
        >
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              value={form.name}
              onChange={onChangeText("name")}
              placeholder="Habit name"
              className="border border-slate-300 rounded-lg px-3 py-2"
              required
            />
            <select
              value={form.targetType}
              onChange={onChangeText("targetType")}
              className="border border-slate-300 rounded-lg px-3 py-2"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
            <input
              type="number"
              min="1"
              value={form.targetCount}
              onChange={onChangeText("targetCount")}
              className="border border-slate-300 rounded-lg px-3 py-2"
              required
            />
            <input
              type="color"
              value={form.color ?? "#0ea5e9"}
              onChange={onChangeText("color")}
              className="border border-slate-300 rounded-lg px-3 py-2 h-10"
              title="Habit color"
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

        <Card className="max-w-none" title="Habit List" color="gray">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-14 bg-slate-100 border border-slate-200 rounded-lg animate-pulse" />
              <div className="h-14 bg-slate-100 border border-slate-200 rounded-lg animate-pulse" />
            </div>
          ) : habits.length === 0 ? (
            <p className="text-sm text-slate-500">No habits found yet.</p>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {habit.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {habit.targetType} • target {habit.targetCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void handleCheckIn(habit.id)}
                      className="p-2 rounded-lg hover:bg-emerald-50"
                      aria-label="Check in habit"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => startEdit(habit)}
                      className="p-2 rounded-lg hover:bg-slate-100"
                      aria-label="Edit habit"
                    >
                      <Pencil className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => void handleDelete(habit.id)}
                      className="p-2 rounded-lg hover:bg-red-50"
                      aria-label="Delete habit"
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

export default Habits;
