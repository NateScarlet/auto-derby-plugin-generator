<template>
  <label
    class="form-button inline-flex flex-center"
    :class="{
      'bg-blue-400 text-white hover:bg-blue-300': actionProxy === 'ban',
    }"
  >
    <svg class="fill-current h-6" viewBox="0 0 24 24">
      <path :d="mdiCancel"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="ban" />
  </label>
  <label
    class="form-button inline-flex flex-center"
    :class="{
      'bg-blue-400 text-white hover:bg-blue-300': actionProxy === 'less',
    }"
  >
    <svg class="fill-current h-6" viewBox="0 0 24 24">
      <path :d="mdiThumbDown"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="less" />
  </label>
  <label
    class="form-button inline-flex flex-center"
    :class="{
      'bg-blue-400 text-white hover:bg-blue-300': actionProxy === 'none',
    }"
  >
    <svg class="fill-current h-6" viewBox="0 0 24 24">
      <path :d="mdiThumbsUpDown"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="none" />
  </label>
  <label
    class="form-button inline-flex flex-center"
    :class="{
      'bg-blue-400 text-white hover:bg-blue-300': actionProxy === 'more',
    }"
  >
    <svg class="fill-current h-6" viewBox="0 0 24 24">
      <path :d="mdiThumbUp"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="more" />
  </label>
  <label
    class="form-button inline-flex flex-center"
    :class="{
      'bg-blue-400 text-white hover:bg-blue-300': actionProxy === 'pick',
    }"
  >
    <svg class="fill-current h-6" viewBox="0 0 24 24">
      <path :d="mdiShieldCheck"></path>
    </svg>
    <input v-model="actionProxy" type="radio" class="hidden" value="pick" />
  </label>
</template>

<script lang="ts">
import usePropVModel from "@/composables/usePropVModel";
import type { Action } from "@/plugin-generators/race";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import {
  mdiCancel,
  mdiShieldCheck,
  mdiThumbDown,
  mdiThumbsUpDown,
  mdiThumbUp,
} from "@mdi/js";

export default defineComponent({
  name: "RaceActionInput",
  props: {
    modelValue: {
      type: String as PropType<Action>,
      required: true,
    },
  },
  setup: (props, ctx) => {
    const actionProxy = usePropVModel(ctx, props, "modelValue");
    return {
      actionProxy,
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
