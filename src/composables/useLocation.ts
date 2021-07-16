import useCleanup from "@/composables/useCleanup";
import type { Ref } from "vue";
import { customRef } from "vue";

export default function useLocation(): Readonly<Ref<Location>> {
  const { addCleanup } = useCleanup();
  return customRef((track, trigger) => {
    window.addEventListener("popstate", trigger);
    window.addEventListener("hashchange", trigger);
    addCleanup(() => {
      window.removeEventListener("popstate", trigger);
      window.removeEventListener("hashchange", trigger);
    });
    return {
      get() {
        track();
        return window.location;
      },
      set() {
        // readonly
      },
    };
  });
}
