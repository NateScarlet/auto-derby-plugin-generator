export default class EventEmitter<
  TArgs extends unknown[] = [],
  TReturn = void
> {
  protected listeners = new Set<(...args: TArgs) => TReturn>();

  addEventListener(fn: (...args: TArgs) => TReturn): void {
    this.listeners.add(fn);
  }

  removeEventListener(fn: (...args: TArgs) => TReturn): void {
    this.listeners.delete(fn);
  }

  async dispatchEvent(...args: TArgs): Promise<void> {
    const jobs: TReturn[] = [];
    this.listeners.forEach((i) => {
      jobs.push(i(...args));
    });
    await Promise.all(jobs);
  }
}
