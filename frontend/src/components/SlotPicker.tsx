import { useState } from "react";
import type { EventType, Slot } from "../types/types";
import { useSlots } from "../hooks/useSlots";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

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

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function SlotPicker({
  eventType,
  onSlotSelected,
  onBack,
}: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [focusDate, setFocusDate] = useState(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: slots, isLoading } = useSlots(eventType.id, focusDate);

  const availableSlotsByDate = (slots ?? []).reduce(
    (acc, slot) => {
      const dateKey = getDateKey(new Date(slot.startTime));
      if (slot.status === "available") {
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot);
      }
      return acc;
    },
    {} as Record<string, Slot[]>,
  );

  const availableDates = Object.keys(availableSlotsByDate);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    setSelectedDate(date);
    setSheetOpen(true);
  }

  function handleSlotClick(slot: Slot) {
    setSheetOpen(false);
    setSelectedDate(null);
    onSlotSelected(slot.startTime);
  }

  const selectedDaySlots = selectedDate
    ? (availableSlotsByDate[getDateKey(selectedDate)] ?? [])
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="pl-0">
          Back
        </Button>
        <div>
          <h2 className="text-xl font-medium">Select a Date & Time</h2>
          <p className="text-muted-foreground text-sm">
            {eventType.name} · {eventType.durationMinutes} min
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={handleSelect}
            onMonthChange={setFocusDate}
            modifiers={{
              available: availableDates.map((d) => new Date(d)),
            }}
            modifiersClassNames={{
              available:
                "bg-green-100 text-green-900 hover:bg-green-200 font-medium",
            }}
            disabled={(date) => {
              const dateKey = getDateKey(date);
              const hasSlots = !!availableSlotsByDate[dateKey];
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
              return !hasSlots || isPast;
            }}
          />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center text-muted-foreground py-4">
          Loading slots...
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>
              {selectedDate ? formatDate(selectedDate.toISOString()) : ""}
            </SheetTitle>
            <SheetDescription>
              {eventType.durationMinutes}-minute {eventType.name.toLowerCase()}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Available times</h4>
            {selectedDaySlots.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No available slots
              </p>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-3 gap-2">
                  {selectedDaySlots.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant="outline"
                      onClick={() => handleSlotClick(slot)}
                      className="text-sm"
                    >
                      {formatTime(slot.startTime)}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
