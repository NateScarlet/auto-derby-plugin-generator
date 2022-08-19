import EventEmitter from "@/events/emitter";
import { WorkboxCacheUpdatedEvent } from "@/utils/isWorkboxBroadcastUpdateEvent";

export const workboxCacheUpdate = new EventEmitter<
  [WorkboxCacheUpdatedEvent]
>();
