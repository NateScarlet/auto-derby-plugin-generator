import type { Ref } from 'vue';
import { computed } from 'vue';

export default function usePropVModel<
  T,
  TName extends Extract<keyof T, string>
>(
  ctx: {
    emit(event: `update:${TName}`, payload: T[TName]): void;
  },
  props: T,
  name: TName,
  normalize: (v: unknown) => T[TName] = (i) => i as T[TName]
): Ref<T[TName]> {
  const ret = computed({
    get() {
      return normalize(props[name]);
    },
    set(v: T[TName]) {
      const n = normalize(v);
      if (n === props[name]) {
        // skip event if not changed
        return;
      }
      ctx.emit(`update:${name}` as `update:${TName}`, n);
    },
  });

  return ret;
}
