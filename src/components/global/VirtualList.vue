<template>
  <component
    :is="is"
    ref="el"
    class="overflow-auto"
    @scroll.passive="virtualScroll($el.scrollTop)"
  >
    <template v-if="itemCount <= 1">
      <slot v-if="itemCount === 0" name="placeholder" />
      <template v-for="i in values">
        <slot :value="i" :attrs="{}" />
      </template>
    </template>
    <template v-else>
      <div :style="viewportStyle">
        <template v-for="i in visibleItems" :key="i.key">
          <slot v-bind="i" />
        </template>
      </div>
    </template>
  </component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, computed, reactive, ref, watch } from 'vue';
import useElementSize from '@/composables/useElementSize';

export default defineComponent({ name: 'VirtualList' });
</script>

<script setup lang="ts">
const props = defineProps({
  is: {
    type: String,
    default: 'div',
  },
  values: {
    type: Array as PropType<unknown[]>,
    required: true,
  },
  totalCount: {
    type: Number,
    default: undefined,
  },
  itemHeight: {
    type: Number,
    required: true,
  },
});

const el = ref<HTMLElement>();
const itemCount = computed(() => props.totalCount ?? props.values.length);
const { borderBoxHeight: height, contentBoxWidth: width } = useElementSize(el);
const size = computed(() => Math.ceil(height.value / props.itemHeight));
const topIndex = ref(0);
const viewportStyle = reactive({
  paddingTop: '0',
  paddingBottom: '0',
});
const visibleItems = computed(() =>
  props.values
    .slice(topIndex.value, topIndex.value + size.value + 1)
    .map((i, index) => ({
      value: i,
      key: topIndex.value + index,
      index: topIndex.value + index,
      attrs: {
        style: {
          height: `${props.itemHeight}px`,
          overflow: 'hidden',
        },
      },
    }))
);

const virtualScroll = (top: number) => {
  topIndex.value = Math.floor(top / props.itemHeight);
  const itemsBottom = props.itemHeight * (topIndex.value + size.value + 1);
  const totalBottom = props.itemHeight * itemCount.value;
  viewportStyle.paddingTop = `${topIndex.value * props.itemHeight}px`;
  viewportStyle.paddingBottom = `${Math.max(totalBottom - itemsBottom, 0)}px`;
};
watch(
  () => props.values,
  () => {
    if (el.value) {
      virtualScroll(el.value.scrollTop);
    }
  },
  { immediate: true, deep: true }
);
</script>
