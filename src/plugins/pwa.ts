import { mdiLoading, mdiUpdate } from '@mdi/js';
import { registerSW } from 'virtual:pwa-register';
import { h, ref } from 'vue';
import { message } from '@/message';
import isWorkboxCacheUpdatedEvent from '@/utils/isWorkboxBroadcastUpdateEvent';
import events from '@/events';
import { isDevelopmentMode } from '@/settings';
import useStorage from '@/composables/useStorage';
import sleep from '@/utils/sleep';
import useDisposal from '@/composables/useDisposal';

function showMessage({
  updateSW,
}: {
  updateSW: () => Promise<void>;
}): () => void {
  const isLoading = ref(false);
  return message(() =>
    h(
      'li',
      {
        class:
          'rounded-sm w-64 mx-2 my-1 bg-gray-100 text-black break-all flex items-center',
      },
      [
        h(
          'button',
          {
            class: 'form-button w-full inline-flex flex-center py-0 px-2',
            onClick: async () => {
              isLoading.value = true;
              await updateSW();
            },
          },
          [
            h(
              'svg',
              {
                viewBox: '0 0 24 24',
                class: [
                  'fill-current h-8 origin-center',
                  isLoading.value ? 'animate-spin' : '',
                ],
              },
              h('path', { d: isLoading.value ? mdiLoading : mdiUpdate })
            ),
            h('div', { class: 'm-2 flex-auto' }, 'New version available'),
          ]
        ),
      ]
    )
  );
}

if (isDevelopmentMode) {
  const skipSWMessageDebugUntil = useStorage(
    localStorage,
    `skipSWMessageDebugUntil@74fc1042-fc0f-4d76-ad1c-131378b19813`,
    0
  );
  if (
    !skipSWMessageDebugUntil.value ||
    skipSWMessageDebugUntil.value < Date.now()
  ) {
    const closeMessage = showMessage({
      updateSW: async () => {
        // eslint-disable-next-line no-console
        console.log('dummy updateSW');
        skipSWMessageDebugUntil.value = Date.now() + 24 * 3600e3;
        await sleep(1500);
        closeMessage();
      },
    });
  }
}

export default function install(): void {
  const d = useDisposal();
  navigator.serviceWorker.addEventListener('message', async (event) => {
    if (isWorkboxCacheUpdatedEvent(event)) {
      events.workboxCacheUpdate.dispatchEvent(event);
    }
  });
  const updateSW = registerSW({
    onNeedRefresh() {
      d.dispose();
      const closeMessage = showMessage({
        updateSW: async () => {
          await updateSW();
          closeMessage();
          // reload for second tab, `updateSW(true)` not work
          window.location.reload();
        },
      });
      d.add(closeMessage);
    },
  });
}
