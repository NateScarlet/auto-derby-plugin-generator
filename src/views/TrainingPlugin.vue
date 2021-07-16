<template>
  <form action="javascript:void(0)" @submit="save()">
    <TrainingScoreChart v-model="formData.scores" />
    {{ formData }}
    <label>
      Name
      <input type="text" class="form-input" />
    </label>
    <button class="form-button">Save</button>
  </form>
</template>

<script lang="ts">
import TrainingScoreChart from "@/components/TrainingScoreChart.vue";
import type { Input } from "@/plugin-generators/training";
import generate from "@/plugin-generators/training";
import { saveAs } from "file-saver";
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "TrainingPlugin",
  components: {
    TrainingScoreChart,
  },
  props: {},
  setup: () => {
    const formData: Input = reactive({
      scores: [],
    });

    const save = () => {
      const body = generate(formData);
      saveAs(new Blob([body], { type: "application/octet-stream" }), "tmp.py");
    };
    return {
      save,
      formData,
    };
  },
});
</script>
