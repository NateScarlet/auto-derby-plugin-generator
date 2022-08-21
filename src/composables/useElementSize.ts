import type { Ref } from 'vue';
import { ref, watch } from 'vue';
import addResizeListener from '@/utils/addResizeListener';
import useCleanup from '@/composables/useCleanup';

export default function useElementSize(el: Ref<Element | null | undefined>): {
  borderBoxWidth: Ref<number>;
  borderBoxHeight: Ref<number>;
  contentBoxWidth: Ref<number>;
  contentBoxHeight: Ref<number>;
} {
  const borderBoxWidth = ref(0);
  const borderBoxHeight = ref(0);
  const contentBoxWidth = ref(0);
  const contentBoxHeight = ref(0);

  const update = () => {
    const { value } = el;
    if (!value) {
      return;
    }
    const bBox = value.getBoundingClientRect();
    borderBoxWidth.value = bBox.width;
    borderBoxHeight.value = bBox.height;
    contentBoxWidth.value = value.clientWidth;
    contentBoxHeight.value = value.clientHeight;
  };
  update();

  const { addCleanup, cleanup } = useCleanup();

  watch(
    el,
    (elv) => {
      cleanup();
      if (!elv) {
        return;
      }
      addCleanup(
        // avoid forced reflow.
        addResizeListener(elv, () => {
          requestAnimationFrame(update);
        })
      );
    },
    { immediate: true }
  );

  return {
    borderBoxHeight,
    borderBoxWidth,
    contentBoxHeight,
    contentBoxWidth,
  };
}
