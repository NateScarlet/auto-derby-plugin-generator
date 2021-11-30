<template>
  <DropdownMenu
    ref="dropdown"
    v-model:visible="dropdownVisible"
    class="select"
    :dropdown-class="dropdownClass"
  >
    <output
      ref="output"
      class="inline-block form-select cursor-pointer relative w-full"
      :tabindex="dropdownVisible || disabled ? undefined : 0"
      :class="{
        'bg-none': clearButtonVisible,
        [outputClass]: true,
        [disabledClass]: disabled,
      }"
      @focus="focus()"
    >
      <div
        class="
          inline-flex
          items-center
          flex-wrap
          overflow-auto
          align-top
          w-full
          gap-1
        "
      >
        <template v-if="values.length > 0">
          <slot name="output" :selected="selected">
            <template v-for="i in selected">
              <template v-if="multiple">
                <div
                  :key="i.key"
                  class="
                    inline-flex
                    items-center
                    border
                    flex-none
                    box-border
                    bg-gray-200
                    pl-1
                    pr-6
                    rounded
                    h-6
                    relative
                  "
                >
                  <slot v-bind="entryContext(i, 'output')"
                    ><span>{{
                      i.label != null ? i.label : i.value
                    }}</span></slot
                  >
                  <button
                    class="
                      absolute
                      right-0
                      top-0
                      h-full
                      pr-1
                      text-gray-400
                      outline-none
                    "
                    tabindex="-1"
                    type="button"
                  >
                    <svg
                      class="w-4 fill-current"
                      viewBox="0 0 24 24"
                      @click="toggle(i.key, false)"
                    >
                      <path :d="mdiCloseCircle"></path>
                    </svg>
                  </button>
                </div>
              </template>
              <template v-else>
                <slot v-bind="entryContext(i, 'output')">
                  <span :key="i.key">{{
                    i.label != null ? i.label : i.value
                  }}</span>
                </slot>
              </template>
            </template>
          </slot>
        </template>
        <template v-else>
          <slot name="placeholder"
            ><span class="text-gray-500">{{ placeholder }}</span></slot
          >
        </template>
      </div>
      <template v-if="clearButtonVisible">
        <button
          class="
            flex
            absolute
            top-0
            bottom-0
            right-0
            px-2
            cursor-pointer
            text-gray-500
            items-center
            outline-none
          "
          type="button"
          tabindex="-1"
          title="清空"
          @click.prevent="
            clear();
            blur();
          "
        >
          <svg class="w-6 fill-current" viewBox="0 0 24 24">
            <path :d="mdiClose"></path>
          </svg>
        </button>
      </template>
    </output>
    <template #dropdown>
      <slot name="search" :inputListeners="inputListeners"></slot>
      <ol
        ref="optionList"
        class="max-h-96 overflow-y-auto"
        aria-orientation="vertical"
        role="menu"
      >
        <template v-for="i in optionEntries" :key="i.key">
          <li
            :ref="(el) => optionRefFn(el, i.key)"
            class="p-2 cursor-pointer relative"
            :data-key="i.key"
            :class="{
              [highlightClass]: highlight == i.key,
              [disabledClass]: i.disabled,
            }"
            @pointerenter="highlight = i.key"
            @pointerdown.prevent
            @click.prevent="handleOptionClick(i)"
          >
            <slot v-bind="entryContext(i)" :option="i"
              ><span>{{ i.label != null ? i.label : i.value }}</span></slot
            >
            <slot name="suffix" v-bind="entryContext(i)" :option="i">
              <template v-if="multiple && selectedKeys.has(i.key)">
                <div
                  class="
                    flex
                    absolute
                    top-0
                    right-0
                    p-2
                    bottom-0
                    items-center
                    text-gray-500
                  "
                >
                  <svg class="w-6 fill-current" viewBox="0 0 24 24">
                    <path :d="mdiCheck"></path>
                  </svg>
                </div>
              </template>
            </slot>
          </li>
        </template>
      </ol>
    </template>
    <input
      ref="transparentInput"
      class="opacity-0 absolute inset-0 pointer-events-none w-full h-full"
      tabindex="-1"
      aria-hidden="true"
      value=""
      @invalid="$emit('invalid', $event)"
      v-on="hasSearch ? {} : inputListeners"
    />
  </DropdownMenu>
</template>

<script lang="ts">
import {
  mdiCheck,
  mdiChevronDown,
  mdiClose,
  mdiCloseCircle,
  mdiLoading,
} from "@mdi/js";
import cast from "cast-unknown";
import { uniqBy } from "lodash-es";
import type { PropType } from "vue";
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUpdate,
  ref,
  watch,
} from "vue";
import type { Entry, Option } from "./entry";
import { fromOptions as entriesFromOptions } from "./entry";
import type DropdownMenu from "@/components/global/DropdownMenu.vue";
import defaults from "@/components/global/defaults";
import containsDeepChildNode from "@/utils/containsDeepChildNode";
import equalSet from "@/utils/equalSet";
import toHotKey from "@/utils/toHotKey";
import useValidationMessage from "@/composables/useValidationMessage";
import useInfiniteScroll from "@/composables/useInfiniteScroll";

export default defineComponent({
  name: "SelectBox",
  props: {
    modelValue: {
      type: undefined,
      default: undefined,
    } as unknown as PropType<unknown>,
    required: { type: Boolean, default: false },
    requiredMessage: { type: String, default: "请选择" },
    placeholder: { type: String, default: "请选择" },
    nullValue: {
      type: undefined,
      default: undefined,
    } as unknown as PropType<unknown>,
    multiple: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    options: { type: Array as PropType<Option<unknown>[]>, required: true },
    dropdownClass: {
      type: String,
      default: undefined,
    },
    outputClass: { type: String, default: "" },
    highlightClass: {
      type: String,
      default: () => defaults.select.highlightClass,
    },
    disabledClass: {
      type: String,
      default: () => defaults.select.disabledClass,
    },
    inputKeyPrefix: { type: String, default: "__input:" },
    hasMore: {
      type: Boolean,
    },
  },
  emits: {
    "update:modelValue": null,
    change: null,
    focus: null,
    blur: null,
    clear: null,
    invalid: null,
    "fetch-more": null,
  },
  setup: (props, ctx) => {
    const transparentInput = ref<HTMLInputElement>();
    const optionElements = ref<
      Record<string, Pick<HTMLLinkElement, "scrollIntoView">>
    >({});
    const optionRefFn = (el: unknown, key: string) => {
      if (el instanceof HTMLLIElement) {
        optionElements.value[key] = el;
      }
    };
    onBeforeUpdate(() => {
      optionElements.value = {};
    });
    const dropdown = ref<InstanceType<typeof DropdownMenu>>();
    const highlight = ref("");
    const dropdownVisible = ref(false);
    const selectedKeys = ref(new Set<string>());
    const values = computed({
      get(): unknown[] {
        return (
          props.multiple ? cast.array(props.modelValue) : [props.modelValue]
        ).filter((i) => i !== "" && i != null);
      },
      set(v: unknown[]) {
        ctx.emit(
          "update:modelValue",
          props.multiple ? v : v[0] ?? props.nullValue
        );
      },
    });
    const optionEntries = computed(() => entriesFromOptions(props.options));
    const valueEntries = computed(() =>
      values.value.map(
        (i, index) =>
          optionEntries.value.find((o) => o.value === i) ?? {
            key: `${props.inputKeyPrefix}${index}`,
            value: i,
          }
      )
    );
    const entries = computed(() =>
      uniqBy([...optionEntries.value, ...valueEntries.value], (i) => i.key)
    );
    const selected = computed(() =>
      entries.value.filter((i) => selectedKeys.value.has(i.key))
    );
    const clearButtonVisible = computed(
      () => (props.multiple || props.clearable) && selected.value.length > 0
    );
    const hasSearch = computed(() => !!ctx.slots.search);
    const scrollToHighlight = () => {
      optionElements.value[highlight.value]?.scrollIntoView({
        block: "nearest",
      });
    };
    const offsetHighlight = (offset: number): void => {
      const entries2 = optionEntries.value;
      if (entries2.length === 0) {
        return;
      }
      let index = entries2.findIndex((i) => i.key === highlight.value);
      index += offset;
      if (index < 0) {
        index = 0;
      }
      if (index > entries2.length - 1) {
        index = entries2.length - 1;
      }
      const v = entries2[index];
      if (!v) {
        return;
      }
      highlight.value = v.key;
      scrollToHighlight();
    };
    const focus = () => {
      highlight.value = valueEntries.value[0]?.key ?? "";
      dropdownVisible.value = true;
      nextTick(() => {
        scrollToHighlight();
        if (!hasSearch.value) {
          transparentInput.value?.focus();
        }
        ctx.emit("focus");
      });
    };
    const blur = () => {
      if (
        document.activeElement instanceof HTMLElement &&
        dropdown.value &&
        containsDeepChildNode(dropdown.value.$el, document.activeElement)
      ) {
        document.activeElement.blur();
      }
      ctx.emit("blur");
    };
    const { reportValidity, setCustomValidity } = useValidationMessage(
      transparentInput,
      computed(() => {
        if (props.required && values.value.length === 0) {
          return props.requiredMessage;
        }
        return "";
      })
    );
    const toggle = (
      key: string,
      force?: boolean,
      onchange?: (newKeys: Set<string>, oldKeys: Set<string>) => void
    ): void => {
      if (props.options.length === 0) {
        return;
      }
      const selected2 = selectedKeys.value.has(key);
      const wanted = force ?? !selected2;
      if (wanted === selected2) {
        return;
      }
      const keys = new Set(props.multiple ? selectedKeys.value : undefined);
      if (wanted === true) {
        keys.add(key);
      } else if (wanted === false) {
        keys.delete(key);
      }
      const oldKeys = selectedKeys.value;
      selectedKeys.value = keys;
      onchange?.(keys, oldKeys);
    };
    const clear = (): void => {
      selectedKeys.value = new Set();
      ctx.emit("clear");
    };
    const handleOptionClick = (v: Entry<unknown>): void => {
      if (v.disabled) {
        return;
      }
      const onchange = () => {
        ctx.emit("change");
      };
      if (props.multiple) {
        toggle(v.key, undefined, onchange);
      } else {
        toggle(v.key, true, onchange);
        blur();
        dropdownVisible.value = false;
      }
    };
    const entryContext = (
      v: Entry<unknown>,
      location?: string
    ): {
      key_: string;
      value: unknown;
      label?: string;
      disabled?: boolean;
      highlight: boolean;
      selected: boolean;
      multiple: boolean;
      toggle: typeof toggle;
      location?: string;
    } => ({
      highlight: highlight.value === v.key,
      selected: selectedKeys.value.has(v.key),
      toggle,
      multiple: props.multiple,
      key_: v.key,
      value: v.value,
      label: v.label,
      disabled: v.disabled,
      location,
    });
    const updateSelectedKeys = (): void => {
      const keys = new Set(valueEntries.value.map((i) => i.key));
      if (!equalSet(selectedKeys.value, keys)) {
        selectedKeys.value = keys;
      }
    };
    const inputListeners = {
      keydown: (e: KeyboardEvent) => {
        switch (toHotKey(e)) {
          case "ArrowUp":
            e.preventDefault();
            offsetHighlight(-1);
            if (!props.multiple) {
              toggle(highlight.value, true);
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            offsetHighlight(1);
            if (!props.multiple) {
              toggle(highlight.value, true);
            }
            break;
          case "Enter":
            e.preventDefault();
            entries.value
              .filter((i) => i.key === highlight.value)
              .forEach(handleOptionClick);
            break;
          default:
        }
      },
      blur: () => blur(),
      focus: () => focus(),
    };
    watch(
      () => props.modelValue,
      () => {
        updateSelectedKeys();
      },
      { immediate: true, deep: true }
    );
    watch(
      () => props.options,
      () => {
        updateSelectedKeys();
      },
      { deep: true }
    );
    watch(
      () => selectedKeys.value,
      (n) => {
        values.value = entries.value
          .filter((i) => n.has(i.key))
          .map((i) => i.value);
      },
      { deep: true }
    );
    const optionList = ref<HTMLOListElement>();
    useInfiniteScroll(optionList, () => {
      if (props.hasMore) {
        ctx.emit("fetch-more");
      }
    });
    return {
      blur,
      clear,
      clearButtonVisible,
      dropdownVisible,
      entries,
      entryContext,
      focus,
      handleOptionClick,
      hasSearch,
      optionRefFn,
      highlight,
      inputListeners,
      offsetHighlight,
      optionElements,
      optionEntries,
      scrollToHighlight,
      selected,
      selectedKeys,
      setCustomValidity,
      reportValidity,
      toggle,
      transparentInput,
      updateSelectedKeys,
      values,
      optionList,
    };
  },
  data() {
    return {
      mdiCheck,
      mdiChevronDown,
      mdiClose,
      mdiCloseCircle,
      mdiLoading,
    };
  },
});
</script>
