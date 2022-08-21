<template>
  <div>
    <label :class="toolButtonClass('default')">
      <svg class="fill-current h-6" viewBox="-2 -2 28 28">
        <path :d="mdiCursorDefault"></path>
      </svg>
      <input v-model="tool" value="default" type="radio" class="hidden" />
    </label>
    <label :class="toolButtonClass('move')">
      <svg class="fill-current h-6" viewBox="0 0 24 24">
        <path :d="mdiCursorMove"></path>
      </svg>
      <input v-model="tool" value="move" type="radio" class="hidden" />
    </label>
    <label :class="toolButtonClass('add')">
      <svg class="fill-current h-6" viewBox="0 0 24 24">
        <path :d="mdiPlus"></path>
      </svg>
      <input v-model="tool" value="add" type="radio" class="hidden" />
    </label>
    <label :class="toolButtonClass('remove')">
      <svg class="fill-current h-6" viewBox="0 0 24 24">
        <path :d="mdiMinus"></path>
      </svg>
      <input v-model="tool" value="remove" type="radio" class="hidden" />
    </label>
  </div>
  <svg ref="svg" :viewBox="`0 0 ${width} ${height}`"></svg>
</template>

<script lang="ts">
import { mdiCursorDefault, mdiCursorMove, mdiMinus, mdiPlus } from '@mdi/js';
import * as d3 from 'd3';
import { round, sortBy } from 'lodash-es';
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import useCleanup from '@/composables/useCleanup';
import useElementSize from '@/composables/useElementSize';
import type { Vector2 } from '@/composables/useLineSelect';
import useLineSelect from '@/composables/useLineSelect';
import { ALL_TRAINING_TYPE, TrainingType } from '@/constants';
import type { ExpectedScore } from '@/plugin-generators/training';
import distanceVector2 from '@/utils/distanceVector2';

export default defineComponent({
  name: 'TrainingScoreChart',
  props: {
    modelValue: {
      type: Array as PropType<ExpectedScore[]>,
      default: () => [],
    },
  },
  emits: {
    'update:modelValue': (v: ExpectedScore[]) => v != null,
  },
  setup: (props, ctx) => {
    const svg = ref<SVGSVGElement>();
    const tool = ref('default');
    const { width, height } = useElementSize(svg);

    const { addCleanup, cleanup } = useCleanup();
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const domain = {
      xMin: 1,
      xMax: 78,
      yMin: 0,
      yMax: 1200,
    };
    const xScale = computed(() =>
      d3
        .scaleLinear()
        .domain([domain.xMin, domain.xMax])
        .range([margin.left, width.value - margin.right])
    );
    const yScale = computed(() =>
      d3
        .scaleLinear()
        .domain([domain.yMin, domain.yMax])
        .range([height.value - margin.bottom, margin.top])
        .nice()
    );
    const series = computed(() => {
      let ret = ALL_TRAINING_TYPE.map((i) => ({
        type: i,
        values: [] as [number, number][],
      }));
      props.modelValue.forEach((i) => {
        ret.find((j) => j.type === i.type)?.values.push([i.turn, i.value]);
      });
      ret = ret.map((i) => {
        const values = sortBy(i.values, (j) => j[0]);
        if (values.length === 0) {
          values.push([domain.xMin, domain.yMin], [domain.xMax, domain.yMax]);
        }

        if (values[0][0] > 1) {
          values.splice(0, 0, [domain.xMin, values[0][1]]);
        }
        if (values[values.length - 1][0] < domain.xMax) {
          values.push([domain.xMax, values[values.length - 1][1]]);
        }

        return {
          ...i,
          values,
        };
      });
      return ret;
    });
    const cursorPoint = ref<Vector2>([0, 0]);
    const { point: selectedPoint, line: selectedSeries } = useLineSelect(
      series,
      cursorPoint
    );
    const lineColor = d3.scaleOrdinal(d3.schemeTableau10);

    const updateValue = (
      type: TrainingType,
      to: Vector2,
      from?: Vector2
    ): void => {
      let ret = props.modelValue.filter(
        (i) => !(i.type === type && i.turn === to[0])
      );
      if (from) {
        ret = ret.filter(
          (i) => !(i.type === type && i.turn === from[0] && i.value === from[1])
        );
      }
      ret = ret.concat({
        type,
        turn: to[0],
        value: to[1],
      });

      ctx.emit('update:modelValue', ret);
    };

    // const deleteValue = (type: TrainingType, point: Vector2): void => {
    //   ctx.emit(
    //     "update:modelValue",
    //     props.modelValue.filter(
    //       (i) =>
    //         !(i.type === type && i.turn === point[0] && i.value === point[1])
    //     )
    //   );
    // };

    watch(svg, (svgValue) => {
      cleanup();
      if (!svgValue) {
        return;
      }

      const d3SVG = d3.select(svgValue);
      const d3XAxis = d3SVG.append('g');
      const d3YAxis = d3SVG.append('g');
      const d3Lines = d3SVG.append('g');
      const d3HoverPanel = d3SVG.append('g');
      d3HoverPanel.append('circle').attr('r', 2.5).attr('opacity', 0.5);
      const d3HoverText = d3HoverPanel.append('text');
      const d3DotControl = d3SVG.append('g');
      d3DotControl.append('circle').attr('r', 2.5);
      d3DotControl.append('text').attr('y', -8).attr('text-anchor', 'middle');

      const isPressing = ref(false);
      const handleMouseMove = (e: MouseEvent) => {
        const pointer = d3.pointer(e, svgValue);
        const x = xScale.value;
        const y = yScale.value;
        const xPoint = Math.round(x.invert(pointer[0]));
        const yPoint = round(y.invert(pointer[1]), 2);
        cursorPoint.value = [xPoint, yPoint];
        const s = selectedSeries.value;
        const p = selectedPoint.value;
        let targetPoint: Vector2 | undefined;
        if (p && distanceVector2(pointer, [x(p[0]), y(p[1])]) < 64) {
          d3DotControl.attr('display', null);
          d3HoverPanel.attr('display', 'none');
          targetPoint = p;
          svgValue.style.cursor = 'move';
        } else {
          d3DotControl.attr('display', 'none');
          d3HoverPanel.attr('display', null);
          svgValue.style.cursor = 'copy';
        }
        if (s && isPressing.value) {
          updateValue(s.type, [xPoint, yPoint], targetPoint);
        }
        d3HoverPanel.attr('transform', `translate(${x(xPoint)}, ${y(yPoint)})`);
      };
      d3SVG
        .on('mouseenter', () => {
          d3HoverPanel.attr('display', null);
        })
        .on('mousemove', handleMouseMove)
        .on('mouseleave', () => {
          d3HoverPanel.attr('display', 'none');
          d3DotControl.attr('display', 'none');
          d3Lines.selectAll('path').attr('opacity', null);
          isPressing.value = false;
        })
        .on('mousedown', (e: MouseEvent) => {
          e.preventDefault();
          isPressing.value = true;
          handleMouseMove(e);
        })
        .on('mouseup', (e: MouseEvent) => {
          e.preventDefault();
          isPressing.value = false;
        });

      addCleanup(
        watch(
          [width, height, xScale, yScale],
          ([w, h, x, y]) => {
            d3XAxis
              .attr('transform', `translate(0, ${h - margin.bottom})`)
              .call(d3.axisBottom(x).ticks(w / 80));
            d3YAxis
              .attr('transform', `translate(${margin.left}, 0)`)
              .call(d3.axisLeft(y));
          },
          { immediate: true }
        )
      );
      addCleanup(
        watch(
          [series, xScale, yScale],
          ([s, x, y]) => {
            d3Lines
              .selectAll('path')
              .data(s)
              .join('path')
              .attr('stroke', (d) => lineColor(TrainingType[d.type]))
              .datum((d) => d.values)
              .attr('fill', 'none')
              .attr('stroke-width', '1.5')
              .attr(
                'd',
                d3
                  .line()
                  .x((d) => x(d[0]))
                  .y((d) => y(d[1]))
              );
          },
          { immediate: true }
        )
      );
      addCleanup(
        watch(
          [selectedPoint, selectedSeries, xScale, yScale],
          ([p, s, x, y]) => {
            if (!(s && p)) {
              return;
            }
            d3DotControl.attr('transform', `translate(${x(p[0])}, ${y(p[1])})`);
            d3DotControl
              .select('text')
              .text(`${TrainingType[s.type]} ${p[0]} ${p[1]}`);
            d3Lines
              .selectAll('path')
              .attr('opacity', (d) => (d === s.values ? null : '0.5'));
            d3HoverText.text(
              `${TrainingType[s.type]} ${cursorPoint.value[0]} ${
                cursorPoint.value[1]
              }`
            );
          }
        )
      );
    });

    const toolButtonClass = (name: string) => ({
      'form-button inline-block p-1 mx-px': true,
      'bg-blue-500 text-white hover:bg-blue-400': tool.value === name,
    });
    return { svg, width, height, series, tool, toolButtonClass };
  },
  data: () => ({
    mdiCursorDefault,
    mdiCursorMove,
    mdiPlus,
    mdiMinus,
  }),
});
</script>
