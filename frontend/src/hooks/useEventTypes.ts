import { useQuery } from '@tanstack/react-query'
import { guestApi } from '../api/guestApi'

export function useEventTypes() {
  return useQuery({
    queryKey: ['event-types'],
    queryFn: guestApi.getEventTypes,
  })
}