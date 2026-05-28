import { useState } from "react";
import type { EventType, CreateBookingRequest, Booking } from "../types/types";
import { guestApi } from "../api/guestApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingFormProps {
  eventType: EventType;
  slotTime: string;
  onBack: () => void;
  onBooked: (booking: Booking) => void;
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString([], {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export function BookingForm({ eventType, slotTime, onBack, onBooked }: BookingFormProps) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const request: CreateBookingRequest = {
        eventTypeId: eventType.id,
        slotTime,
        guestName,
        guestEmail,
      };
      const booking = await guestApi.createBooking(request);
      onBooked(booking);
    } catch {
      setError("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="pl-0">
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Your Booking</CardTitle>
          <CardDescription>
            Enter your details to confirm the meeting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Event</span>
              <span className="font-medium">{eventType.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date & Time</span>
              <span className="font-medium">{formatDateTime(slotTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="font-medium">{eventType.durationMinutes} min</span>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                placeholder="john@example.com"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}