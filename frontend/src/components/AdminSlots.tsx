import { useState, useEffect } from "react";
import { adminApi } from "../api/adminApi";

const DAYS = [
  { dayOfWeek: 0, name: "Sunday" },
  { dayOfWeek: 1, name: "Monday" },
  { dayOfWeek: 2, name: "Tuesday" },
  { dayOfWeek: 3, name: "Wednesday" },
  { dayOfWeek: 4, name: "Thursday" },
  { dayOfWeek: 5, name: "Friday" },
  { dayOfWeek: 6, name: "Saturday" },
];

interface SlotRow {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface AdminSlotsProps {
  onSaved?: () => void;
}

export function AdminSlots({ onSaved }: AdminSlotsProps) {
  const [slots, setSlots] = useState<SlotRow[]>(
    DAYS.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      enabled: false,
      startTime: "09:00",
      endTime: "17:00",
    })),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    try {
      const data = await adminApi.getSlots();
      const slotsMap = new Map(data.map((s) => [s.dayOfWeek, s]));
      setSlots(
        DAYS.map((d) => {
          const existing = slotsMap.get(d.dayOfWeek);
          if (existing) {
            return {
              dayOfWeek: d.dayOfWeek,
              enabled: true,
              startTime: existing.startTime,
              endTime: existing.endTime,
            };
          }
          return {
            dayOfWeek: d.dayOfWeek,
            enabled: false,
            startTime: "09:00",
            endTime: "17:00",
          };
        }),
      );
    } catch (err) {
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const enabledSlots = slots
        .filter((s) => s.enabled)
        .map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        }));
      await adminApi.createSlots(enabledSlots);
      onSaved?.();
    } catch (err) {
      setError("Failed to save slots");
    } finally {
      setSaving(false);
    }
  }

  function updateSlot(
    dayOfWeek: number,
    field: keyof SlotRow,
    value: string | boolean,
  ) {
    setSlots((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s,
      ),
    );
  }

  if (loading) {
    return <p className="text-black/50">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-black mb-4">
        Weekly Availability
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-3 mb-6">
        {slots.map((slot) => {
          const dayName =
            DAYS.find((d) => d.dayOfWeek === slot.dayOfWeek)?.name ?? "";
          return (
            <div key={slot.dayOfWeek} className="flex items-center gap-4">
              <div className="w-28">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slot.enabled}
                    onChange={(e) =>
                      updateSlot(slot.dayOfWeek, "enabled", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span className="font-medium">{dayName}</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateSlot(slot.dayOfWeek, "startTime", e.target.value)
                  }
                  disabled={!slot.enabled}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                />
                <span className="text-black/50">to</span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateSlot(slot.dayOfWeek, "endTime", e.target.value)
                  }
                  disabled={!slot.enabled}
                  className="px-3 py-2 border rounded disabled:opacity-50"
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
