<template>
  <form action="javascript:void(0)" @submit="save()">
    <TrainingScoreChart />
    <label>
      Name
      <input type="text" class="form-input" />
    </label>
    <button class="form-button">Save</button>
  </form>
</template>

<script lang="ts">
import TrainingScoreChart from "@/components/TrainingScoreChart.vue";
import { defineComponent } from "vue";

import type { Input } from "@/plugin-generators/training";
import generate from "@/plugin-generators/training";
import { saveAs } from "file-saver";

export default defineComponent({
  name: "TrainingPlugin",
  components: {
    TrainingScoreChart,
  },
  props: {},
  setup: () => {
    const formData: Input = {
      scores: [],
    };

    const save = () => {
      const body = generate(formData);
      saveAs(new Blob([body], { type: "application/octet-stream" }), "tmp.py");
    };
    return {
      save,
    };
  },
});
</script>
