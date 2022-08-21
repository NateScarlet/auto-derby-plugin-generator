import EventEmitter from '@/events/emitter';
import type { WorkboxCacheUpdatedEvent } from '@/utils/isWorkboxBroadcastUpdateEvent';

// eslint-disable-next-line import/prefer-default-export
export const workboxCacheUpdate = new EventEmitter<
  [WorkboxCacheUpdatedEvent]
>();
