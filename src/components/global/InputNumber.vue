<template>
  <input
    ref="el"
    v-model.lazy="valueString"
    class="text-center spin-button-none"
    type="number"
    @focus="$event.target.select()"
    @blur="$event.target.value = valueString"
    @keyup.enter="$event.target.blur()"
    @keyup.esc="$event.target.blur()"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import usePropVModel from "@/composables/usePropVModel";

export default defineComponent({
  name: "InputNumber",
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    default: {
      type: Number,
      default: undefined,
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
  },
  setup: (props, ctx) => {
    const el = ref<HTMLInputElement>();
    const valueProxy = usePropVModel(ctx, props, "modelValue", (v) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        return props.default || props.modelValue;
      }
      if (props.min != null && v < props.min) {
        return props.min;
      }
      if (props.max != null && v > props.max) {
        return props.max;
      }
      return v;
    });
    const valueString = computed({
      get() {
        if (valueProxy.value == null) {
          return "";
        }
        return valueProxy.value.toString();
      },
      set(v: string) {
        valueProxy.value = parseFloat(v);
      },
    });
    return {
      el,
      valueProxy,
      valueString,
    };
  },
});
</script>
