import type { Ref } from "vue";
import { watch, isReadonly, ref, computed } from "vue";

export default function useValidationMessage(
  input: Ref<HTMLInputElement | undefined>,
  validationMessage: Ref<string>
) {
  const reportValidity = (): boolean => {
    if (!input.value) {
      return false;
    }
    return input.value.reportValidity();
  };
  const writableValidationMessage = isReadonly(validationMessage)
    ? ref("")
    : validationMessage;
  const msgProxy = computed({
    get() {
      return writableValidationMessage.value || validationMessage.value;
    },
    set(v: string) {
      writableValidationMessage.value = v;
    },
  });
  watch([msgProxy, input] as const, ([msg, el]) => {
    el?.setCustomValidity(msg);
  });
  const setCustomValidity = (error: string) => {
    msgProxy.value = error;
  };
  return {
    reportValidity,
    setCustomValidity,
  };
}
