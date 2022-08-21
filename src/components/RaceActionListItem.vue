<template>
  <li class="flex max-w-2xl m-1">
    <div
      class="text-sm text-center w-24 flex-none hidden sm:flex my-2 flex-center"
      :class="{ invisible: hideDate }"
    >
      <SingleModeTurnBlock :value="turn" />
    </div>
    <div
      class="w-full rounded border-2 p-1 border-gray-200 flex flex-col justify-between max-w-lg"
    >
      <div>
        <span class="font-bold text-lg">
          {{ race.name }}
        </span>
        <span class="float-right text-sm sm:hidden text-gray-500">
          <SingleModeTurnWidgetVue :value="turn" />
        </span>
      </div>
      <hr class="border-t border-gray-300" />
      <div class="text-xs sm:text-sm text-gray-600 space-x-2">
        <span>
          {{ stadiumText(race) }}
        </span>
        <span>
          {{ gradeText(race) }}
        </span>
        <span>
          {{ groundText(race) }}
        </span>
        <span>
          {{ distanceText(race) }}
        </span>
        <span> +{{ race.fanCounts[0] }}人 </span>
      </div>

      <div class="flex w-full">
        <RaceActionInputVue v-model="actionProxy" />
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import RaceActionInputVue from '@/components/RaceActionInput.vue';
import SingleModeTurnWidgetVue from '@/components/SingleModeTurnWidget.vue';
import usePropVModel from '@/composables/usePropVModel';
import type { Action } from '@/plugin-generators/race';
import Race from '@/domain/single_mode/Race';
import Grade from '@/domain/single_mode/Grade';
import Ground from '@/domain/single_mode/Ground';
import SingleModeTurnBlock from '@/components/SingleModeTurnBlock.vue';
</script>

<script setup lang="ts">
const props = defineProps({
  turn: {
    type: Number,
    required: true,
  },
  race: {
    type: Race,
    required: true,
  },
  action: {
    type: String as PropType<Action>,
    required: true,
  },
  hideDate: {
    type: Boolean,
  },
});
const emit = defineEmits<{
  (e: 'update:action', v: Action): void;
}>();

const actionProxy = usePropVModel({ emit }, props, 'action');
const stadiumText = (race: Race): string => {
  if (race.grade === Grade.NOT_WINNING) {
    return '...';
  }
  return race.stadium;
};
const groundText = (race: Race): string => {
  if (race.grade === Grade.NOT_WINNING) {
    return '...';
  }
  switch (race.ground) {
    case Ground.TURF:
      return '芝';
    case Ground.DART:
      return 'ダート';
    default:
      return Ground[race.ground];
  }
};
const distanceText = (race: Race): string => {
  if (race.grade === Grade.NOT_WINNING) {
    return '...';
  }
  return `${race.distance}m`;
};
const gradeText = (race: Race): string => {
  switch (race.grade) {
    case Grade.NOT_WINNING:
      return '未勝利戦';
    case Grade.PRE_OP:
      return 'Pre-OP';
    default:
      return Grade[race.grade];
  }
};
</script>
