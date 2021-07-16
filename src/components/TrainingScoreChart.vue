<template>
  <div>
    <label
      class="form-button inline-flex flex-center"
      :class="{
        'bg-blue-400 text-white hover:bg-blue-300': tool === 'plus',
      }"
    >
      <svg class="fill-current h-8" viewBox="0 0 24 24">
        <path :d="mdiPlus"></path>
      </svg>
      <input v-model="tool" type="radio" class="hidden" value="plus" />
    </label>
    <label
      class="form-button inline-flex flex-center"
      :class="{
        'bg-blue-400 text-white hover:bg-blue-300': tool === 'move',
      }"
    >
      <svg class="fill-current h-8" viewBox="0 0 24 24">
        <path :d="mdiCursorMove"></path>
      </svg>
      <input v-model="tool" type="radio" class="hidden" value="move" />
    </label>
    <label
      class="form-button inline-flex flex-center"
      :class="{
        'bg-blue-400 text-white hover:bg-blue-300': tool === 'minus',
      }"
    >
      <svg class="fill-current h-8" viewBox="0 0 24 24">
        <path :d="mdiMinus"></path>
      </svg>
      <input v-model="tool" type="radio" class="hidden" value="minus" />
    </label>
  </div>
  <svg ref="svg" :viewBox="`0 0 ${width} ${height}`"></svg>
</template>

<script lang="ts">
import useCleanup from "@/composables/useCleanup";
import useElementSize from "@/composables/useElementSize";
import type { ExpectedScore } from "@/plugin-generators/training";
import distanceVector2 from "@/utils/distanceVector2";
import { mdiCursorMove, mdiMinus, mdiPencil, mdiPlus } from "@mdi/js";
import * as d3 from "d3";
import { sortBy } from "lodash-es";
import type { PropType} from "vue";
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "TrainingScoreChart",
  props: {
    modelValue: {
      type: Array as PropType<ExpectedScore[]>,
      default: () => [],
    },
  },
  setup: (props) => {
    const svg = ref<SVGSVGElement>();
    const tool = ref("");

    const { width, height } = useElementSize(svg);

    const { addCleanup, cleanup } = useCleanup();
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const domain = {
      xMin: 1,
      xMax: 78,
      yMin: 0,
      yMax: 1200,
    };
    const x = d3.scaleLinear().domain([domain.xMin, domain.xMax]);
    const y = d3.scaleLinear().domain([domain.yMin, domain.yMax]);
    const series = computed(() =>
      [
        {
          name: "test",
          values: [
            { x: 24, y: 300 },
            { x: 70, y: 1200 },
          ],
        },
        {
          name: "test2",
          values: [
            { x: 24, y: 400 },
            { x: 72, y: 1000 },
          ],
        },
      ].map((i) => {
        const values = sortBy(i.values, (j) => j.x);
        if (values.length === 0) {
          values.push(
            { x: domain.xMin, y: domain.yMin },
            { x: domain.xMax, y: domain.yMax }
          );
        }

        if (values[0].x > 1) {
          values.splice(0, 0, { x: domain.xMin, y: values[0].y });
        }
        if (values[values.length - 1].x < domain.xMax) {
          values.push({ x: domain.xMax, y: values[values.length - 1].y });
        }

        return {
          ...i,
          values,
        };
      })
    );

    const lineColor = d3.scaleOrdinal(d3.schemeTableau10);
    watch(svg, (svgValue) => {
      cleanup();
      if (!svgValue) {
        return;
      }

      const d3SVG = d3.select(svgValue);
      const d3XAxis = d3SVG.append("g");
      const d3YAxis = d3SVG.append("g");
      const d3Lines = d3SVG.append("g");
      const d3HoverPanel = d3SVG.append("g");
      const d3HoverText = d3HoverPanel.append("text");
      const d3DotControl = d3SVG.append("g");
      d3DotControl.append("circle").attr("r", 2.5);
      d3DotControl.append("text").attr("y", -8).attr("text-anchor", "middle");
      d3SVG
        .on("mouseenter", () => {
          d3HoverPanel.attr("display", null);
        })
        .on("mousemove", function onMouseover(e) {
          const pointer = d3.pointer(e, this);
          const xValue = x.invert(pointer[0]);
          const yValue = y.invert(pointer[1]);

          const serial = d3.least(series.value, (i) =>
            Math.min(
              ...i.values.map((j) =>
                distanceVector2([j.x, j.y], [xValue, yValue])
              )
            )
          );
          if (!serial) {
            return;
          }
          const serialX = serial.values.map((i) => i.x);
          const index = d3.bisectCenter(serialX, xValue);
          const xClosest = serial.values[index].x;
          const yClosest = serial.values[index].y;

          d3DotControl.attr(
            "transform",
            `translate(${x(xClosest)}, ${y(yClosest)})`
          );
          d3DotControl.select("text").text(`${xClosest} ${yClosest}`);
          d3Lines
            .selectAll("path")
            .attr("opacity", (d) => (d === serial?.values ? null : "0.5"));
          d3HoverText.text(`${serial?.name} ${xValue} ${yValue}`);
          d3HoverPanel.attr(
            "transform",
            `translate(${pointer[0]}, ${pointer[1]})`
          );
        })
        .on("mouseleave", () => {
          d3HoverPanel.attr("display", "none");
          d3Lines.selectAll("path").attr("opacity", null);
        });

      addCleanup(
        watch(
          [width, height],
          ([w, h]) => {
            x.range([margin.left, w - margin.right]);
            d3XAxis
              .attr("transform", `translate(0, ${h - margin.bottom})`)
              .call(d3.axisBottom(x).ticks(w / 80));
            y.range([h - margin.bottom, margin.top]).nice();
            d3YAxis
              .attr("transform", `translate(${margin.left}, 0)`)
              .call(d3.axisLeft(y));
            addCleanup(
              watch(
                series,
                (seriesValue) => {
                  d3Lines
                    .selectAll("path")
                    .data(seriesValue)
                    .join("path")
                    .attr("stroke", (d) => lineColor(d.name))
                    .datum((d) => d.values)
                    .attr("fill", "none")
                    .attr("stroke-width", "1.5")
                    .attr(
                      "d",
                      d3
                        .line<{ x: number; y: number }>()
                        .x((d) => x(d.x))
                        .y((d) => y(d.y))
                    );
                },
                { immediate: true }
              )
            );
          },
          { immediate: true }
        )
      );
    });
    return { svg, width, height, series, tool };
  },
  data() {
    return {
      mdiPlus,
      mdiMinus,
      mdiCursorMove,
    };
  },
});
</script>
