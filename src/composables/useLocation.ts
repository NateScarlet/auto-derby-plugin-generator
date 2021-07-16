import useCleanup from '@/composables/useCleanup';
import type { Ref } from 'vue';
import { customRef } from 'vue';

export default function useLocation(): Readonly<Ref<Location>> {
  const { addCleanup } = useCleanup();
  return customRef((track, trigger) => {
    addEventListener('popstate', trigger);
    addEventListener('hashchange', trigger);
    addCleanup(() => {
      removeEventListener('popstate', trigger);
      removeEventListener('hashchange', trigger);
    });
    return {
      get() {
        track();
        return location;
      },
      set() {
        // readonly
      },
    };
  });
}
