export default function isEventTargetScrollToBottom(e: Event): boolean {
  if (!(e.target instanceof HTMLElement)) {
    return false;
  }
  const el = e.target;
  if (el.scrollTop + el.clientHeight === el.scrollHeight) {
    return true;
  }
  return false;
}
