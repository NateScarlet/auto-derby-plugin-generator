<template>
  <slot v-bind="$attrs"> </slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Variable',
});
</script>
