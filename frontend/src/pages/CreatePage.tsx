import { useState } from "react";
import type { EventType, Booking } from "../types/types";
import { useEventTypes } from "../hooks/useEventTypes";
import { SlotPicker } from "@/components/SlotPicker";
import { BookingForm } from "@/components/BookingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type Step = "select-event" | "select-slot" | "fill-form" | "confirmed";

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString([], {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export function CreatePage() {
  const { data: eventTypes, isLoading, error } = useEventTypes();
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [step, setStep] = useState<Step>("select-event");

  function handleEventTypeSelect(eventType: EventType) {
    setSelectedEventType(eventType);
    setStep("select-slot");
  }

  function handleSlotSelected(slotTime: string) {
    setSelectedSlotTime(slotTime);
    setStep("fill-form");
  }

  function handleBackFromSlotPicker() {
    setSelectedEventType(null);
    setStep("select-event");
  }

  function handleBackFromForm() {
    setSelectedSlotTime(null);
    setStep("select-slot");
  }

  function handleBooked(booking: Booking) {
    setConfirmedBooking(booking);
    setStep("confirmed");
  }

  if (step === "confirmed" && confirmedBooking) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Booking Confirmed!</CardTitle>
            <CardDescription>
              Your meeting has been successfully scheduled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <p className="font-medium">{selectedEventType?.name}</p>
              <p className="text-sm text-green-700">{formatDateTime(confirmedBooking.slotTime)}</p>
              <p className="text-sm text-green-600">
                Confirmation sent to {confirmedBooking.guestEmail}
              </p>
            </div>
            <Button
              onClick={() => {
                setStep("select-event");
                setSelectedEventType(null);
                setSelectedSlotTime(null);
                setConfirmedBooking(null);
              }}
              className="w-full"
            >
              Book Another Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "select-slot" && selectedEventType) {
    return (
      <div className="p-8">
        <SlotPicker
          eventType={selectedEventType}
          onSlotSelected={handleSlotSelected}
          onBack={handleBackFromSlotPicker}
        />
      </div>
    );
  }

  if (step === "fill-form" && selectedEventType && selectedSlotTime) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <BookingForm
          eventType={selectedEventType}
          slotTime={selectedSlotTime}
          onBack={handleBackFromForm}
          onBooked={handleBooked}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-medium mb-6">Create Meeting</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-medium mb-6">Create Meeting</h1>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading event types</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-2">Create Meeting</h1>
      <p className="text-muted-foreground mb-6">Select an event type</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventTypes?.map((eventType) => (
          <Card
            key={eventType.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
            onClick={() => handleEventTypeSelect(eventType)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{eventType.name}</CardTitle>
                <Badge variant="secondary">{eventType.durationMinutes} min</Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {eventType.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}