import { useQuery } from "@tanstack/react-query";
import { guestApi } from "../api/guestApi";

function getMonthBoundaries(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
  return { from, to };
}

export function useSlots(eventTypeId: string | null, focusDate: Date = new Date()) {
  const { from, to } = getMonthBoundaries(focusDate);

  return useQuery({
    queryKey: ["slots", eventTypeId, from, to],
    queryFn: () => guestApi.getSlots(eventTypeId!, from, to),
    enabled: !!eventTypeId,
  });
}