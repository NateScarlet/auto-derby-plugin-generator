<template>
  <li class="mb-1">
    <div
      class="text-sm font-bold text-center border-t-2"
      :class="{ invisible: hideDate }"
    >
      <SingleModeTurnWidgetVue :value="turn" />
    </div>
    <div class="flex">
      <div class="flex-auto">
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
        <div>
          {{ race.name }}
        </div>
      </div>
      <div class="flex-none">
        <RaceActionInputVue v-model="actionProxy" />
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import {
  mdiCancel,
  mdiShieldCheck,
  mdiThumbDown,
  mdiThumbsUpDown,
  mdiThumbUp,
} from "@mdi/js";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import RaceActionInputVue from "@/components/RaceActionInput.vue";
import SingleModeTurnWidgetVue from "@/components/SingleModeTurnWidget.vue";
import usePropVModel from "@/composables/usePropVModel";
import type { Action } from "@/plugin-generators/race";
import SingleModeRace, { Grade, Ground } from "@/single_mode_race";

export default defineComponent({
  name: "RaceActionListItem",
  components: {
    SingleModeTurnWidgetVue,
    RaceActionInputVue,
  },
  props: {
    turn: {
      type: Number,
      required: true,
    },
    race: {
      type: SingleModeRace,
      required: true,
    },
    action: {
      type: String as PropType<Action>,
      required: true,
    },
    hideDate: {
      type: Boolean,
    },
  },
  emits: {
    "update:action": (v: Action) => v != null,
  },
  setup: (props, ctx) => {
    const actionProxy = usePropVModel(ctx, props, "action");
    const stadiumText = (race: SingleModeRace): string => {
      if (race.grade === Grade.NOT_WINNING) {
        return "...";
      }
      return race.stadium;
    };
    const groundText = (race: SingleModeRace): string => {
      if (race.grade === Grade.NOT_WINNING) {
        return "...";
      }
      switch (race.ground) {
        case Ground.TURF:
          return "芝";
        case Ground.DART:
          return "ダート";
        default:
          return Ground[race.ground];
      }
    };
    const distanceText = (race: SingleModeRace): string => {
      if (race.grade === Grade.NOT_WINNING) {
        return "...";
      }
      return `${race.distance}m`;
    };
    const gradeText = (race: SingleModeRace): string => {
      switch (race.grade) {
        case Grade.NOT_WINNING:
          return "未勝利戦";
        case Grade.PRE_OP:
          return "Pre-OP";
        default:
          return Grade[race.grade];
      }
    };

    return {
      stadiumText,
      groundText,
      gradeText,
      distanceText,
      actionProxy,
    };
  },
  data() {
    return {
      mdiCancel,
      mdiShieldCheck,
      mdiThumbUp,
      mdiThumbDown,
      mdiThumbsUpDown,
    };
  },
});
</script>
