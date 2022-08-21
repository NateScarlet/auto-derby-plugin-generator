<template>
  <form
    class="flex-auto overflow-hidden flex flex-col"
    action="javascript:void(0)"
    @submit="save()"
  >
    <RaceActionListVue
      v-model="formData.raceActions"
      class="flex-auto overflow-hidden"
      :default-action="formData.defaultAction"
    />
    <div class="flex mt-1">
      <span class="flex-auto">
        <i18n-t keypath="race-plugin.default-strategy"></i18n-t>
      </span>
      <RaceActionInputVue v-model="formData.defaultAction" />
    </div>
    <div class="flex items-center my-1">
      <label class="flex-auto flex items-center">
        <i18n-t keypath="plugin.name"></i18n-t>
        <input
          v-model="formData.name"
          type="text"
          class="form-input flex-auto"
        />
      </label>
      <button
        type="submit"
        class="form-button flex-none w-32 h-10 inline-flex flex-center"
      >
        <svg class="inline align-top fill-current h-8" viewBox="0 0 24 24">
          <path :d="mdiDownload"></path>
        </svg>
        <span>
          <i18n-t keypath="plugin.generate"></i18n-t>
        </span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { saveAs } from 'file-saver';
import { reactive } from 'vue';
import { mdiDownload } from '@mdi/js';
import RaceActionInputVue from '@/components/RaceActionInput.vue';
import RaceActionListVue from '@/components/RaceActionList.vue';
import type { Action, RaceAction } from '@/plugin-generators/race';
import generate from '@/plugin-generators/race';
</script>

<script setup lang="ts">
const formData = reactive({
  name: 'custom_race',
  raceActions: [] as RaceAction[],
  defaultAction: 'none' as Action,
});

const save = () => {
  const body = generate(formData);
  saveAs(
    new Blob([body], { type: 'application/octet-stream' }),
    `${formData.name}.py`
  );
};
</script>
