import { useState } from "react";
import { adminApi } from "../api/adminApi";
import type { EventType } from "../types/types";

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
    } catch (err) {
      setError("Failed to create event type");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-black mb-4">Create Event Type</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Consultation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="30-minute consultation call"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
            required
            min={1}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}