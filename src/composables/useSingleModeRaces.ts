import usePromise from "@/composables/usePromise";
import SingleModeRace from "@/single_mode_race";
import isNonNull from "@/utils/isNonNull";
import type { Ref } from "vue";
import { computed, ref } from "vue";

export default function useSingleModeRaces(): Ref<SingleModeRace[]> {
  const races = usePromise(
    computed(async () => {
      const resp = await fetch(
        "https://cdn.jsdelivr.net/gh/NateScarlet/auto-derby@master/single_mode_races.jsonl"
      );
      return (await resp.text())
        .split("\n")
        .map((i) => {
          try {
            return new SingleModeRace(JSON.parse(i));
          } catch {
            return undefined;
          }
        })
        .filter(isNonNull);
    }),
    ref([])
  );
  return races;
}
