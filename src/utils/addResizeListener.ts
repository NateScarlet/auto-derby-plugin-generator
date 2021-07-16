import type { ResizeObserverEntry } from "@juggle/resize-observer";
import { ResizeObserver } from "@juggle/resize-observer";

export default function addResizeListener(
  el: Element,
  fn: (entry: ResizeObserverEntry) => void
): () => void {
  const ob = new ResizeObserver((entries): void => {
    entries.forEach((i) => fn(i));
  });

  ob.observe(el);
  return (): void => ob.unobserve(el);
}
