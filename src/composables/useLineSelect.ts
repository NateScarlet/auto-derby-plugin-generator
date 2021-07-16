import distanceVector2 from "@/utils/distanceVector2";
import * as d3 from "d3";
import { computed, ComputedRef, Ref } from "vue";

export type Vector2 = readonly [x: number, y: number];

export interface Line {
  values: Vector2[];
}

export default function useLineSelect<T extends Line>(
  lines: Ref<T[]>,
  cursor: Ref<Vector2>
): {
  line: ComputedRef<T | undefined>;
  index: ComputedRef<number>;
  point: ComputedRef<Vector2 | undefined>;
} {
  const line = computed(() =>
    d3.least(lines.value, (i) =>
      Math.min(
        ...i.values.map((j) =>
          distanceVector2([j[0], j[1]], [cursor.value[0], cursor.value[1]])
        )
      )
    )
  );

  const index = computed((): number => {
    if (!line.value) {
      return -1;
    }
    const allX = line.value.values.map((i) => i[0]) ?? [];
    return d3.bisectCenter(allX, cursor.value[0]);
  });
  const point = computed((): Vector2 | undefined => {
    const i = index.value;
    if (!line.value || i < 0) {
      return undefined;
    }
    const x = line.value.values[i][0];
    const y = line.value.values[i][1];
    return [x, y];
  });
  return {
    line,
    index,
    point,
  };
}
