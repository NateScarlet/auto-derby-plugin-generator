<template>
  <input v-model="formData.query" class="form-input" placeholder="Search" />
  <label>
    dart
    <input
      v-model="formData.includeDart"
      class="form-checkbox border"
      type="checkbox"
    />
  </label>
  <label>
    turf
    <input
      v-model="formData.includeTurf"
      class="form-checkbox border"
      type="checkbox"
    />
  </label>
  <label>
    modified ({{ modelValue.length }})
    <input
      v-model="formData.modifiedOnly"
      class="form-checkbox border"
      type="checkbox"
    />
  </label>
  <VirtualList is="ol" :values="listData" :item-height="48" :size="16">
    <template #default="{ value: i, attrs }">
      <RaceActionListItemVue
        v-bind="attrs"
        :turn="i.turn"
        :race="i.race"
        :action="i.action"
        @update:action="i.handleUpdateAction"
      />
    </template>
  </VirtualList>
</template>

<script lang="ts">
import RaceActionListItemVue from "@/components/RaceActionListItem.vue";
import usePropVModel from "@/composables/usePropVModel";
import useSingleModeRaces from "@/composables/useSingleModeRaces";
import type { Action, RaceAction } from "@/plugin-generators/race";
import { Grade, Ground } from "@/single_mode_race";
import { uniqBy } from "lodash-es";
import type { PropType } from "vue";
import { computed, defineComponent, reactive } from "vue";

export default defineComponent({
  name: "RaceActionList",
  components: {
    RaceActionListItemVue,
  },
  props: {
    modelValue: {
      type: Array as PropType<RaceAction[]>,
      required: true,
    },
    defaultAction: {
      type: String as PropType<Action>,
      default: "none",
    },
  },
  emits: {
    "update:modelValue": null,
  },
  setup: (props, ctx) => {
    const modelValueProxy = usePropVModel(ctx, props, "modelValue");
    const races = useSingleModeRaces();
    const formData = reactive({
      query: "",
      modifiedOnly: false,
      includeTurf: true,
      includeDart: true,
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
        if (!i.race.name.includes(formData.query)) {
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
        return true;
      })
    );

    const listData = computed(() =>
      uniqBy(filteredRaces.value, (i) => `${i.turn}:${i.race.name}`).map(
        (i) => ({
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
        })
      )
    );
    return {
      races,
      normalizedRaces,
      filteredRaces,
      listData,
      formData,
    };
  },
});
</script>
