export type WorkboxCacheUpdatedEvent = MessageEvent<{
  type: "CACHE_UPDATED";
  meta: "workbox-broadcast-update";
  payload: {
    cacheName: string;
    updatedURL: string;
  };
}>;

export default function isWorkboxCacheUpdatedEvent(
  e: unknown
): e is WorkboxCacheUpdatedEvent {
  return (
    e instanceof MessageEvent && e.data.meta === "workbox-broadcast-update"
  );
}
