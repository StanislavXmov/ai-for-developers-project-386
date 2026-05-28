import { useState } from "react";
import { adminApi } from "../api/adminApi";
import type { EventType } from "../types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EventTypesProps {
  onCreated?: (eventType: EventType) => void;
}

export function EventTypes({ onCreated }: EventTypesProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const newEventType = await adminApi.createEventType({
        id: crypto.randomUUID(),
        name,
        description,
        durationMinutes,
      });
      setName("");
      setDescription("");
      setDurationMinutes(30);
      onCreated?.(newEventType);
    } catch {
      setError("Failed to create event type");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event Type</CardTitle>
        <CardDescription>
          Add a new type of meeting you offer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Consultation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="30-minute consultation call"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
              required
              min={1}
              className="w-32"
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Event Type"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}