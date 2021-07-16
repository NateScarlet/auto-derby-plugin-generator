<template>
  <li class="flex">
    <span class="w-48">
      <SingleModeTurnWidgetVue :value="turn" />
    </span>
    <span class="w-32 ml-2">
      {{ gradeText(race) }}
    </span>
    <span class="w-24">
      {{ groundText(race) }}
    </span>
    <span class="w-24">
      {{ distanceText(race) }}
    </span>
    <span>
      {{ race.name }}
    </span>
    <span class="flex-auto text-right">
      <RaceActionInputVue v-model="actionProxy" />
    </span>
  </li>
</template>

<script lang="ts">
import RaceActionInputVue from "@/components/RaceActionInput.vue";
import SingleModeTurnWidgetVue from "@/components/SingleModeTurnWidget.vue";
import usePropVModel from "@/composables/usePropVModel";
import type { Action } from "@/plugin-generators/race";
import SingleModeRace, { Grade, Ground } from "@/single_mode_race";
import {
  mdiCancel,
  mdiShieldCheck,
  mdiThumbDown,
  mdiThumbsUpDown,
  mdiThumbUp,
} from "@mdi/js";
import type { PropType } from "vue";
import { defineComponent } from "vue";

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
  },
  emits: {
    "update:action": (v: Action) => v != null,
  },
  setup: (props, ctx) => {
    const actionProxy = usePropVModel(ctx, props, "action");
    const groundText = (race: SingleModeRace): string => {
      if (race.grade === Grade.NOT_WINNING) {
        return "...";
      }
      return Ground[race.ground];
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
