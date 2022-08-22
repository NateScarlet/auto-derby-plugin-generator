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

  fetchDidSucceed: WorkboxPlugin['fetchDidSucceed'];

  cacheKeyWillBeUsed: WorkboxPlugin['cacheKeyWillBeUsed'];

  constructor({
    paramKey = 'v',
    paramValue = () => Math.trunc(Date.now() / 60e3).toString(),
  }: {
    paramKey?: string;
    paramValue?: () => string;
  } = {}) {
    const cacheKey = (request: Request): string => {
      const url = new URL(request.url);
      url.searchParams.delete(paramKey);
      return url.toString();
    };

    this.requestWillFetch = async ({ request }) => {
      const url = new URL(request.url);
      url.searchParams.set(paramKey, paramValue());
      const cachedResp = await self.caches.match(cacheKey(request));
      const cachedETag = cachedResp?.headers.get('ETag');
      if (cachedETag) {
        const currentETag = (await fetch(url, { method: 'HEAD' })).headers.get(
          'ETag'
        );
        if (currentETag === cachedETag) {
          // no key means use cache
          url.searchParams.delete(paramKey);
        }
      }

      return new Request(url, request);
    };

    this.fetchDidSucceed = async ({ response, request }) => {
      const url = new URL(response.url);
      if (url.searchParams.has(paramKey)) {
        return response;
      }
      return (await self.caches.match(cacheKey(request))) ?? response;
    };

    this.cacheKeyWillBeUsed = async ({ request }) => {
      return cacheKey(request);
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
