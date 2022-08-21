import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { defineComponent, h, useAttrs, useSlots } from 'vue';
import { createI18n, useI18n as _useI18n } from 'vue-i18n';
import { isDevelopmentMode } from '@/settings';

export const supportedLanguages = Object.keys(messages);

const defaultFallback = 'en';

export const locale = ((): string => {
  if (supportedLanguages.includes(navigator.language)) {
    return navigator.language;
  }
  if (navigator.languages) {
    const ret = navigator.languages.find((i): boolean =>
      supportedLanguages.includes(i)
    );
    if (ret) {
      return ret;
    }
  }
  return import.meta.env.VUE_APP_I18N_LOCALE || defaultFallback;
})();

const i18n = createI18n({
  legacy: true,
  locale: import.meta.env.VUE_APP_I18N_LOCALE || locale || defaultFallback,
  fallbackLocale:
    import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || defaultFallback,
  messages,
});

if (isDevelopmentMode) {
  const rawInstall = i18n.install;
  i18n.install = (app, options) => {
    rawInstall(app, options);
    // eslint-disable-next-line no-console
    console.log(
      'patching i18nT to disable scope warning\nhttps://github.com/intlify/vue-i18n-next/discussions/962'
    );
    const rawI18nT = app.component('i18n-t');
    if (!rawI18nT) {
      throw new Error('missing i18n-t component');
    }
    const i18nT = defineComponent({
      render() {
        return h(
          rawI18nT as any,
          { scope: 'global', ...useAttrs() },
          useSlots()
        );
      },
    });

    // eslint-disable-next-line vue/component-definition-name-casing
    app.component('i18n-t', i18nT);
  };
}

export function tr(key: string, d?: string): string {
  const { te, t } = i18n.global;
  if (d != null) {
    return te(key) ? t(key).toString() : d;
  }
  return t(key).toString();
}

export default i18n;
