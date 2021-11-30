<template>
  <div ref="el" class="relative text-left inline-block">
    <slot />
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-out duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
      @before-enter="$emit('open')"
      @after-leave="$emit('close')"
    >
      <div
        v-show="visible"
        class="origin-top-right absolute right-0 mt-px z-30"
        :class="[dropdownBaseClass, dropdownClass]"
      >
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import defaults from '@/components/global/defaults';
import useEventListener from '@/composables/useEventListener';
import containsDeepChildNode from '@/utils/containsDeepChildNode';

export default defineComponent({
  name: 'DropdownMenu',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    dropdownBaseClass: {
      type: String,
      default: () => defaults.dropdown.baseClass,
    },
    dropdownClass: {
      type: String,
      default: 'w-full',
    },
  },
  emits: {
    'update:visible': null,
    open: null,
    close: null,
  },
  setup: (props, ctx) => {
    const el = ref<HTMLElement>();

    const hideIfEventTargetOutside = (e: Event) => {
      if (
        !props.visible ||
        !el.value ||
        e.target === el.value ||
        !(e.target instanceof Node)
      ) {
        return;
      }
      if (!containsDeepChildNode(el.value, e.target)) {
        ctx.emit('update:visible', false);
      }
    };
    useEventListener(ref(document), 'click', hideIfEventTargetOutside, {
      capture: true,
    });
    useEventListener(ref(document), 'focus', hideIfEventTargetOutside, {
      capture: true,
    });
    return { el };
  },
});
</script>
