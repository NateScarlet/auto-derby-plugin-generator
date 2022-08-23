import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update';
import type { WorkboxPlugin } from 'workbox-core';
import { SINGLE_MODE_RACE_DATA_URL } from '@/settings';

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// self.__WB_MANIFEST is default injection point
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
  SINGLE_MODE_RACE_DATA_URL,
  new StaleWhileRevalidate({
    plugins: [new BroadcastUpdatePlugin()],
  })
);
