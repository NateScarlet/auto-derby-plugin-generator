<template>
  <label :class="labelClass('ban')">
    <svg :class="svgClass" viewBox="0 0 24 24">
      <path :d="mdiCancel"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="ban" />
  </label>
  <label :class="labelClass('less')">
    <svg :class="svgClass" viewBox="0 0 24 24">
      <path :d="mdiThumbDown"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="less" />
  </label>
  <label :class="labelClass('none')">
    <svg :class="svgClass" viewBox="0 0 24 24">
      <path :d="mdiThumbsUpDown"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="none" />
  </label>
  <label :class="labelClass('more')">
    <svg :class="svgClass" viewBox="0 0 24 24">
      <path :d="mdiThumbUp"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="more" />
  </label>
  <label :class="labelClass('pick')">
    <svg :class="svgClass" viewBox="0 0 24 24">
      <path :d="mdiShieldCheck"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="pick" />
  </label>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import {
  mdiCancel,
  mdiShieldCheck,
  mdiThumbDown,
  mdiThumbsUpDown,
  mdiThumbUp,
} from '@mdi/js';
import type { Action } from '@/plugin-generators/race';
import usePropVModel from '@/composables/usePropVModel';

export default defineComponent({
  name: 'RaceActionInput',
  props: {
    modelValue: {
      type: String as PropType<Action>,
      required: true,
    },
  },
  setup: (props, ctx) => {
    const actionProxy = usePropVModel(ctx, props, 'modelValue');
    const labelClass = (action: string) => ({
      'form-button inline-flex flex-center p-px h-8 flex-auto': true,
      'bg-blue-400 text-white hover:bg-blue-300': actionProxy.value === action,
    });
    const svgClass = 'fill-current h-6 py-px';
    return {
      actionProxy,
      labelClass,
      svgClass,
    };
  },
  data() {
    return {
      mdiCancel,
      mdiShieldCheck,
      mdiThumbUp,
      mdiThumbDown,
      mdiThumbsUpDown,
    };
  },
});
</script>
