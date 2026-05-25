import { useState } from "react";
import { Alert, Skeleton, Card, Text, Group, Badge } from "@mantine/core";
import { useEventTypes } from "../hooks/useEventTypes";
import type { EventType } from "../types/types";

export function CreatePage() {
  const { data: eventTypes, isLoading, error } = useEventTypes();
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null,
  );
  console.log("selectedEventType", selectedEventType);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-medium text-black mb-6">Create Meeting</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={120} radius="md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-medium text-black mb-6">Create Meeting</h1>
        <Alert color="red" title="Error loading event types">
          {error instanceof Error ? error.message : "Something went wrong"}
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium text-black mb-2">Create Meeting</h1>
      <p className="text-black/50 mb-6">Select an event type</p>

      {selectedEventType && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <Text size="sm" c="green">
            Selected: {selectedEventType.name}
          </Text>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventTypes?.map((eventType) => (
          <Card
            key={eventType.id}
            padding="md"
            radius="md"
            withBorder
            className="cursor-pointer transition-all hover:shadow-md"
            style={{
              borderColor:
                selectedEventType?.id === eventType.id ? "#228be6" : undefined,
            }}
            onClick={() => setSelectedEventType(eventType)}
          >
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="lg">
                {eventType.name}
              </Text>
              <Badge variant="light" size="sm">
                {eventType.durationMinutes} min
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" lineClamp={2}>
              {eventType.description}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
}
