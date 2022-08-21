<template>
  <div
    class="flex flex-center flex-col min-h-full max-w-lg text-lg gap-8 container m-auto lg:py-2"
  >
    <div class="w-full">
      <h1 class="text-3xl font-bold text-gray-800">
        <i18n-t keypath="welcome.app-name"></i18n-t>
      </h1>
      <div class="text-gray-500"></div>
    </div>
    <div class="flex w-full min-h-64">
      <section>
        <h1 class="text-2xl text-gray-500">
          <i18n-t keypath="welcome.start"></i18n-t>
        </h1>
        <ol>
          <li>
            <RouterLink to="/plugins/race" class="ui-link">
              <i18n-t keypath="welcome.generate-race-plugin"></i18n-t>
            </RouterLink>
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
defineExpose({});
</script>
