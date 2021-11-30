<template>
  {{ turn.yearText }}
  {{ turn.monthText }}
  {{ turn.halfText }}
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import useSingleModeTurn from "@/composables/useSingleModeTurn";

export default defineComponent({
  name: "SingleModeTurnWidget",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  setup: (props) => {
    const turn = computed(() => useSingleModeTurn(props.value));
    return {
      turn,
    };
  },
});
</script>
