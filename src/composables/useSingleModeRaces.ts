import type { Ref } from 'vue';
import { computed, ref } from 'vue';
import usePromise from '@/composables/usePromise';
import { SINGLE_MODE_RACE_DATA_URL } from '@/settings';
import SingleModeRace from '@/single_mode_race';
import isNonNull from '@/utils/isNonNull';
import events from '@/events';

const version = ref(0);

events.workboxCacheUpdate.addEventListener((e) => {
  if (e.data.payload.updatedURL === SINGLE_MODE_RACE_DATA_URL) {
    version.value += 1;
  }
});
const races = usePromise(
  computed(async () => {
    const _ = version.value; // refetch on version change
    const resp = await fetch(SINGLE_MODE_RACE_DATA_URL);
    return (await resp.text())
      .split('\n')
      .map((i) => {
        try {
          return new SingleModeRace(JSON.parse(i));
        } catch {
          return undefined;
        }
      })
      .filter(isNonNull);
  }),
  ref([]),
  {
    keepLatest: true,
  }
);
export default function useSingleModeRaces(): Ref<SingleModeRace[]> {
  return races;
}
