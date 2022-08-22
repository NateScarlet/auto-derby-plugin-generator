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

class ForceRevalidatePlugin implements WorkboxPlugin {
  requestWillFetch: WorkboxPlugin['requestWillFetch'];

  cacheKeyWillBeUsed: WorkboxPlugin['cacheKeyWillBeUsed'];

  constructor({
    paramKey = 'v',
    paramValue = () => Math.trunc(Date.now() / 60e3).toString(),
  }: {
    paramKey?: string;
    paramValue?: () => string;
  } = {}) {
    this.requestWillFetch = async ({ request }) => {
      const url = new URL(request.url);
      url.searchParams.set(paramKey, paramValue());

      return new Request(url, request);
    };
    this.cacheKeyWillBeUsed = async ({ request }) => {
      const url = new URL(request.url);
      url.searchParams.delete(paramKey);
      return url.toString();
    };
  }
}

// self.__WB_MANIFEST is default injection point
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
  SINGLE_MODE_RACE_DATA_URL,
  new StaleWhileRevalidate({
    plugins: [new ForceRevalidatePlugin(), new BroadcastUpdatePlugin()],
  })
);
