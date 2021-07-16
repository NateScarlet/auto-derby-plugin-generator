<template>
  <div class="drawer fixed inset-0 z-20">
    <transition
      appear="appear"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-300 ease-in-out"
    >
      <div
        class="overlay z-0 absolute inset-0 bg-secondary bg-opacity-50"
        @click="$emit('update:visible', false)"
        v-if="visible"
      ></div>
    </transition>
    <transition
      appear="appear"
      enter-from-class="transform translate-x-full"
      leave-to-class="transform translate-x-full"
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-300 ease-in-out"
      @after-leave="$emit('close')"
      @after-enter="$emit('after-enter')"
    >
      <div
        class="container z-10 absolute m-auto bg-primary h-screen right-0 sm:px-4 overflow-y-auto overflow-x-hidden"
        :class="containerClass"
        v-if="visible"
      >
        <slot name="header">
          <header
            class="flex items-center sm:py-2 sticky bg-primary top-0 z-20"
          >
            <button
              class="form-button"
              type="button"
              @click="$emit('update:visible', false)"
            >
              <svg class="fill-current w-6" viewBox="0 0 24 24">
                <path :d="mdiArrowLeft"></path>
              </svg>
            </button>
            <h1 class="inline-block text-lg sm:text-xl font-semibold mx-2">
              <slot name="title"></slot>
            </h1>
          </header>
        </slot>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { mdiArrowLeft } from '@mdi/js';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Drawer',
  props: {
    visible: { type: Boolean, required: true },
    containerClass: { type: String, default: 'max-w-xl' },
  },
  emits: {
    close: null,
    'update:visible': null,
    'after-enter': null,
  },
  data() {
    return {
      mdiArrowLeft,
    };
  },
});
</script>
