<template>
  <ol class="container m-auto">
    <li class="text-blue-400">
      <router-link to="/plugins/race">
        {{ t('plugin-type.race') }}
      </router-link>
    </li>
    <!-- <li class="text-blue-400">
      <router-link to="/plugins/training">
        {{ t("plugin-type.training") }}
      </router-link>
    </li> -->
  </ol>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from '@/plugins/i18n';

export default defineComponent({
  name: 'IndexView',
  setup() {
    return {
      ...useI18n(),
    };
  },
});
</script>
