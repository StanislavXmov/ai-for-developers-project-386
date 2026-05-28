import { useState, useEffect } from "react";
import { adminApi } from "../api/adminApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
    } catch {
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
    } catch {
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
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Availability</CardTitle>
        <CardDescription>
          Set your available hours for each day of the week.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {slots.map((slot) => {
            const dayName =
              DAYS.find((d) => d.dayOfWeek === slot.dayOfWeek)?.name ?? "";
            return (
              <div key={slot.dayOfWeek} className="flex items-center gap-4">
                <div className="w-32 flex items-center gap-2">
                  <Switch
                    id={`day-${slot.dayOfWeek}`}
                    checked={slot.enabled}
                    onCheckedChange={(checked) =>
                      updateSlot(slot.dayOfWeek, "enabled", checked)
                    }
                  />
                  <Label
                    htmlFor={`day-${slot.dayOfWeek}`}
                    className="font-medium"
                  >
                    {dayName}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateSlot(slot.dayOfWeek, "startTime", e.target.value)
                    }
                    disabled={!slot.enabled}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      updateSlot(slot.dayOfWeek, "endTime", e.target.value)
                    }
                    disabled={!slot.enabled}
                    className="w-32"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
