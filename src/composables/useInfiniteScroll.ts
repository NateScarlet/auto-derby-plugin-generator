import type { Ref } from 'vue';
import useEventListener from '@/composables/useEventListener';
import isEventTargetScrollToBottom from '@/utils/isEventTargetScrollToBottom';

export default function useInfiniteScroll(
  container: Ref<HTMLElement | undefined>,
  fetchMore: () => void
) {
  useEventListener(container, 'scroll', (e) => {
    if (isEventTargetScrollToBottom(e)) {
      fetchMore();
    }
  });
}
