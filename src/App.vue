<template>
  <nav class="bg-gray-200 text-right">
    <template v-if="route.path != '/'">
      <router-link to="/" class="float-left">
        <svg class="fill-current h-8" viewBox="0 0 24 24">
          <path :d="mdiArrowLeft"></path>
        </svg>
      </router-link>
    </template>
    <span> {{ version }} </span>
    <a
      href="https://github.com/NateScarlet/auto-derby-plugin-generator"
      class="text-blue-400"
    >
      GitHub
    </a>
    <Select
      v-model="lang"
      :options="[
        { key: 'en', value: 'en', label: 'English' },
        { key: 'zh', value: 'zh', label: '中文' },
        { key: 'jp', value: 'jp', label: '日本語' },
      ]"
    />
  </nav>
  <router-view />
  <MessageList />
</template>

<script lang="ts">
import { mdiArrowLeft } from "@mdi/js";
import { defineComponent, watch } from "vue";
import { useRoute } from "vue-router";
import useStorage from "@/composables/useStorage";
import { MessageList } from "@/message";
import i18n from "@/plugins/i18n";

export default defineComponent({
  name: "App",
  components: {
    MessageList,
  },
  setup() {
    const route = useRoute();
    const lang = useStorage(localStorage, "lang", i18n.global.locale);
    watch(
      lang,
      (v) => {
        i18n.global.locale.value = v;
      },
      { immediate: true }
    );
    return { route, lang, version: __VERSION__ };
  },
  data() {
    return {
      mdiArrowLeft,
    };
  },
});
</script>
