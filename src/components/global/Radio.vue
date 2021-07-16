<template>
  <div ref="el" class="inline-block">
    <template v-for="i in optionEntries" :key="i.key">
      <label
        class="mx-1"
        :class="{
          [labelClass]: true,
          [disabledClass]: i.disabled,
        }"
      >
        <input
          v-model="valueProxy"
          class="form-radio"
          type="radio"
          :value="i.value"
          v-bind="$attrs"
          :class="inputClass"
          :disabled="i.disabled"
          @focus="$emit('focus', $event)"
        />
        <slot v-bind="entryContext(i)"
          ><span class="mx-1 align-middle">{{
            i.label != null ? i.label : i.value
          }}</span></slot
        >
      </label>
    </template>
  </div>
</template>

<script lang="ts">
import usePropVModel from '@/composables/usePropVModel';
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import defaults from './defaults';
import type { Entry, Option } from './entry';
import { fromOptions } from './entry';

export default defineComponent({
  name: 'Radio',
  props: {
    modelValue: {
      required: true,
    },
    options: {
      type: Array as PropType<Option<unknown>[]>,
      required: true,
    },
    labelClass: {
      type: String,
      default: 'inline-block',
    },
    inputClass: {
      type: String,
    },
    disabledClass: {
      type: String,
      default: () => defaults.radio.disabledClass,
    },
    equalValue: {
      type: Function as PropType<(a: unknown, b: unknown) => boolean>,
      default: (a: unknown, b: unknown) => a === b,
    },
  },
  emits: {
    'update:modelValue': null,
    change: null,
    focus: null,
  },
  setup: (props, ctx) => {
    const el = ref<HTMLDivElement>();
    const optionEntries = computed(() => fromOptions(props.options));
    const valueProxy = usePropVModel(ctx, props, 'modelValue');
    watch(valueProxy, (n, o) => ctx.emit('change', n, o));

    const entryContext = (
      v: Entry<unknown>,
      location?: string
    ): {
      key_: string;
      value: unknown;
      label?: string;
      disabled?: boolean;
      selected: boolean;
      location?: string;
    } => ({
        selected: props.equalValue(props.modelValue, v.value),
        key_: v.key,
        value: v.value,
        label: v.label,
        disabled: v.disabled,
        location,
      });
    return { el, optionEntries, entryContext, valueProxy };
  },
});
</script>
