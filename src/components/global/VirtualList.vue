<template>
  <component
    :is="is"
    ref="el"
    :style="containerStyle"
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
import { computed, defineComponent, reactive, ref, watch } from 'vue';

export default defineComponent({
  name: 'VirtualList',
  props: {
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
    size: {
      type: Number,
      default: 10,
    },
  },
  setup: (props) => {
    const el = ref<HTMLElement>();
    const itemCount = computed(() => props.totalCount ?? props.values.length);
    const containerStyle = computed(() => ({
      height: `${props.itemHeight * Math.min(props.size, itemCount.value)}px`,
      overflowY: 'auto',
    }));
    const topIndex = ref(0);
    const viewportStyle = reactive({
      paddingTop: '0',
      paddingBottom: '0',
    });
    const visibleItems = computed(() =>
      props.values
        .slice(topIndex.value, topIndex.value + props.size + 1)
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
      const itemsBottom = props.itemHeight * (topIndex.value + props.size + 1);
      const totalBottom = props.itemHeight * itemCount.value;
      viewportStyle.paddingTop = `${topIndex.value * props.itemHeight}px`;
      viewportStyle.paddingBottom = `${Math.max(
        totalBottom - itemsBottom,
        0
      )}px`;
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

    return {
      el,
      itemCount,
      containerStyle,
      visibleItems,
      virtualScroll,
      viewportStyle,
    };
  },
});
</script>
