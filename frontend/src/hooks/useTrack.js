import { analyticsApi } from '../api'

export function useTrack() {
  const track = (eventType, data = {}) => {
    analyticsApi.track({ event_type: eventType, ...data }).catch(() => {})
  }
  return { track }
}
