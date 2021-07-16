import messages from '@intlify/vite-plugin-vue-i18n/messages';
import type { UseI18nOptions } from 'vue-i18n';
import { createI18n, useI18n as _useI18n } from 'vue-i18n';

export const supportedLanguages = Object.keys(messages);

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
  return import.meta.env.VUE_APP_I18N_LOCALE ?? 'en';
})();

export function useI18n(options?: UseI18nOptions): ReturnType<
  typeof _useI18n
> & {
  td: (key: string, defaultValue?: string) => string;
} {
  const i18n = _useI18n(options);
  const td = (key: string, defaultValue?: string): string => {
    if (defaultValue != null) {
      return i18n.te(key) ? i18n.t(key).toString() : defaultValue;
    }
    return i18n.t(key).toString();
  };

  return {
    ...i18n,
    td,
  };
}

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
});
