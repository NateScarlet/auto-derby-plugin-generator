export default function equalSet<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) {
    return false;
  }
  if (Array.from(a).some(i => !b.has(i))) {
    return false;
  }
  return true;
}
