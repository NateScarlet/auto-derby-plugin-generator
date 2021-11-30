<template>
  <form action="javascript:void(0)" @submit="save()">
    <RaceActionListVue
      v-model="formData.raceActions"
      :default-action="formData.defaultAction"
    />
    <p class="flex">
      <span class="flex-auto"> Default </span>
      <RaceActionInputVue v-model="formData.defaultAction" />
    </p>
    <label>
      Name
      <input v-model="formData.name" type="text" class="form-input" />
    </label>
    <button class="form-button">Save</button>
  </form>
</template>

<script lang="ts">
import { saveAs } from "file-saver";
import { defineComponent, reactive } from "vue";
import RaceActionInputVue from "@/components/RaceActionInput.vue";
import RaceActionListVue from "@/components/RaceActionList.vue";
import type { Action, RaceAction } from "@/plugin-generators/race";
import generate from "@/plugin-generators/race";

export default defineComponent({
  name: "RacePlugin",
  components: {
    RaceActionListVue,
    RaceActionInputVue,
  },
  setup: () => {
    const formData = reactive({
      name: "custom_race",
      raceActions: [] as RaceAction[],
      defaultAction: "none" as Action,
    });

    const save = () => {
      const body = generate(formData);
      saveAs(
        new Blob([body], { type: "application/octet-stream" }),
        `${formData.name}.py`
      );
    };
    return {
      formData,
      save,
    };
  },
});
</script>
