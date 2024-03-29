<template>
  <div class="flex flex-col overflow-hidden">
    <div class="flex-none flex flex-wrap items-center space-x-2">
      <input
        v-model="formData.query"
        type="search"
        class="form-input"
        placeholder="Search race or stadium name"
      />
      <div class="inline-flex flex-col">
        <label>
          ダート
          <input
            v-model="formData.includeDart"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
        <label>
          芝
          <input
            v-model="formData.includeTurf"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
      </div>
      <div class="inline-flex flex-wrap w-48 space-x-2">
        <label>
          G1
          <input
            v-model="formData.includeG1"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
        <label>
          G2
          <input
            v-model="formData.includeG2"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
        <label>
          G3
          <input
            v-model="formData.includeG3"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
        <label>
          Pre-OP
          <input
            v-model="formData.includePreOP"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
        <label>
          OP
          <input
            v-model="formData.includeOP"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
        <label>
          未勝利戦
          <input
            v-model="formData.includeNotWinning"
            class="form-checkbox border"
            type="checkbox"
          />
        </label>
      </div>
      <label>
        modified ({{ modelValue.length }})
        <input
          v-model="formData.modifiedOnly"
          class="form-checkbox border"
          type="checkbox"
        />
      </label>
    </div>
    <VirtualList is="ol" class="flex-auto" :values="listData" :item-height="96">
      <template #default="{ value: i, attrs, index }">
        <RaceActionListItemVue
          v-bind="attrs"
          :turn="i.turn"
          :race="i.race"
          :hide-date="i.turn === listData[index - 1]?.turn"
          :action="i.action"
          @update:action="i.handleUpdateAction"
        />
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import { uniqBy } from 'lodash-es';
import type { PropType } from 'vue';
import { computed, defineComponent, reactive } from 'vue';
import RaceActionListItemVue from '@/components/RaceActionListItem.vue';
import usePropVModel from '@/composables/usePropVModel';
import useSingleModeRaces from '@/composables/useSingleModeRaces';
import type { Action, RaceAction } from '@/plugin-generators/race';
import Grade from '@/domain/single_mode/Grade';
import Ground from '@/domain/single_mode/Ground';
</script>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Array as PropType<RaceAction[]>,
    required: true,
  },
  defaultAction: {
    type: String as PropType<Action>,
    default: 'none',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: RaceAction[]): void;
}>();

const modelValueProxy = usePropVModel({ emit }, props, 'modelValue');
const races = useSingleModeRaces();
const formData = reactive({
  query: '',
  modifiedOnly: false,
  includeTurf: true,
  includeDart: true,
  includeG1: true,
  includeG2: true,
  includeG3: true,
  includePreOP: true,
  includeOP: true,
  includeNotWinning: true,
});
const normalizedRaces = computed(() =>
  races.value
    .flatMap((race) =>
      race.turnCounts().map((turn) => ({
        turn,
        race,
      }))
    )
    .sort((a, b) => (a.turn < b.turn ? -1 : 1))
);
const filteredRaces = computed(() =>
  normalizedRaces.value.filter((i) => {
    if (i.race.isTargetRace()) {
      return false;
    }
    if (
      formData.query.trim() &&
      !formData.query
        .split(' ')
        .filter((word) => word.trim())
        .some(
          (word) => i.race.name.includes(word) || i.race.stadium.includes(word)
        )
    ) {
      return false;
    }
    if (
      formData.modifiedOnly &&
      !modelValueProxy.value.some(
        (j) => j.turn === i.turn && j.name === i.race.name
      )
    ) {
      return false;
    }
    if (i.race.grade !== Grade.NOT_WINNING) {
      if (!formData.includeTurf && i.race.ground === Ground.TURF) {
        return false;
      }
      if (!formData.includeDart && i.race.ground === Ground.DART) {
        return false;
      }
    }
    if (!formData.includeG1 && i.race.grade === Grade.G1) {
      return false;
    }
    if (!formData.includeG2 && i.race.grade === Grade.G2) {
      return false;
    }
    if (!formData.includeG3 && i.race.grade === Grade.G3) {
      return false;
    }
    if (!formData.includePreOP && i.race.grade === Grade.PRE_OP) {
      return false;
    }
    if (!formData.includeOP && i.race.grade === Grade.OP) {
      return false;
    }
    if (!formData.includeNotWinning && i.race.grade === Grade.NOT_WINNING) {
      return false;
    }
    return true;
  })
);

const listData = computed(() =>
  uniqBy(filteredRaces.value, (i) => `${i.turn}:${i.race.name}`).map((i) => ({
    race: i.race,
    turn: i.turn,
    action:
      modelValueProxy.value.find(
        (j) => j.turn === i.turn && j.name === i.race.name
      )?.action ?? props.defaultAction,
    handleUpdateAction: (v: Action) => {
      modelValueProxy.value = [
        ...modelValueProxy.value.filter(
          (j) => !(j.turn === i.turn && j.name === i.race.name)
        ),
        ...(v === props.defaultAction
          ? []
          : [
              {
                turn: i.turn,
                name: i.race.name,
                action: v,
              },
            ]),
      ];
    },
  }))
);
</script>
