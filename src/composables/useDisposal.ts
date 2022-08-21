import { getCurrentInstance, onUnmounted } from 'vue';

export interface Disposable {
  dispose(): void;
}

export type Disposal = Disposable & {
  add: (cb: () => void) => void;
  push: (i: Disposable) => void;
};

export default function useDisposal(): Disposal {
  const filoQueue: (() => void)[] = [];
  const add = (cb: () => void) => {
    filoQueue.push(cb);
  };
  const push = (d: Disposable) => {
    filoQueue.push(() => d.dispose());
  };
  const dispose = () => {
    while (filoQueue.length > 0) {
      filoQueue.pop()?.();
    }
  };

  if (getCurrentInstance()) {
    onUnmounted(dispose);
  }

  return {
    add,
    push,
    dispose,
  };
}
