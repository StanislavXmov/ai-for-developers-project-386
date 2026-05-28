import { useState } from "react";
import type { EventType, Slot } from "../types/types";
import { useSlots } from "../hooks/useSlots";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SlotPickerProps {
  eventType: EventType;
  onSlotSelected: (slotTime: string) => void;
  onBack: () => void;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function SlotPicker({
  eventType,
  onSlotSelected,
  onBack,
}: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [focusDate, setFocusDate] = useState(new Date());

  const { data: slots, isLoading } = useSlots(eventType.id, focusDate);

  const availableSlotsByDate = (slots ?? []).reduce(
    (acc, slot) => {
      if (slot.status !== "available") return acc;

      const dateKey = getDateKey(new Date(slot.startTime));
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    },
    {} as Record<string, Slot[]>,
  );

  const availableDates = Object.keys(availableSlotsByDate);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    setSelectedDate(date);
  }

  function handleSlotClick(slot: Slot) {
    onSlotSelected(slot.startTime);
  }

  const selectedDaySlots = selectedDate
    ? [...(availableSlotsByDate[getDateKey(selectedDate)] ?? [])].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
    : [];

  const selectedSlotLabel =
    selectedDaySlots.length === 1
      ? "1 slot available"
      : `${selectedDaySlots.length} slots available`;

  function handleMonthChange(date: Date) {
    setFocusDate(date);
    setSelectedDate(null);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" onClick={onBack} className="h-9 px-2">
          Back
        </Button>
        <div className="min-w-0">
          <h2 className="text-xl font-medium">Select a Date & Time</h2>
          <p className="text-muted-foreground text-sm">
            {eventType.name} - {eventType.durationMinutes} min
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-6 p-4 md:grid-cols-[360px_1fr] md:p-6">
          <div className="flex justify-center md:justify-start">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={handleSelect}
              onMonthChange={handleMonthChange}
              modifiers={{
                available: availableDates.map(dateFromKey),
              }}
              modifiersClassNames={{
                available: "font-medium underline underline-offset-4",
              }}
              disabled={(date) => {
                const dateKey = getDateKey(date);
                const hasSlots = !!availableSlotsByDate[dateKey];
                const isPast =
                  date < new Date(new Date().setHours(0, 0, 0, 0));
                return !hasSlots || isPast;
              }}
              className="w-full max-w-[340px] [--cell-size:2.35rem]"
            />
          </div>

          <div className="flex min-h-[360px] flex-col rounded-md border bg-muted/20 p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">
                {selectedDate ? formatDate(selectedDate) : "Available times"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {selectedDate
                  ? selectedSlotLabel
                  : `${eventType.durationMinutes}-minute ${eventType.name.toLowerCase()}`}
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed bg-background p-6 text-center text-sm text-muted-foreground">
                Loading slots for this month...
              </div>
            ) : !selectedDate ? (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed bg-background p-6 text-center text-sm text-muted-foreground">
                Select an available date to see times.
              </div>
            ) : selectedDaySlots.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed bg-background p-6 text-center text-sm text-muted-foreground">
                No available times for this date.
              </div>
            ) : (
              <ScrollArea className="min-h-0 flex-1 pr-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {selectedDaySlots.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant="outline"
                      onClick={() => handleSlotClick(slot)}
                      className="h-11 w-full text-sm"
                    >
                      {formatTime(slot.startTime)}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
