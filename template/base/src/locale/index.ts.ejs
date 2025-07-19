import { type App, ref, watch } from 'vue';
import { createI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import dayjsZhCn from 'dayjs/locale/zh-cn';
import dayEn from 'dayjs/locale/en';
import dayAr from 'dayjs/locale/ar';

import { type Language as CoseyLanguage } from 'cosey/locale';
import coseyZhCn from 'cosey/locale/lang/zh-cn';
import coseyEn from 'cosey/locale/lang/en';
import coseyAr from 'cosey/locale/lang/ar';

import zhCn from './lang/zh-cn';
import en from './lang/en';
import ar from './lang/ar';

const coseyLangs = {
  'zh-cn': coseyZhCn,
  en: coseyEn,
  ar: coseyAr,
};

const dayjsLangs = {
  'zh-cn': dayjsZhCn,
  en: dayEn,
  ar: dayAr,
};

const langs = {
  'zh-cn': zhCn,
  en: en,
  ar: ar,
};

export type Language = keyof typeof langs;

const langKey = 'Cosey:lang';

export const locale = ref<Language>((localStorage.getItem(langKey) as Language) || 'zh-cn');

export const coseyLocale = ref<CoseyLanguage>(coseyLangs[locale.value]);

const rtlLangs = ['ar'];

export function setupI18n(app: App) {
  const i18n = createI18n({
    locale: locale.value,
    fallbackLocale: locale.value,
    messages: langs,
    silentTranslationWarn: true,
    silentFallbackWarn: true,
  });

  watch(
    locale,
    (locale) => {
      i18n.global.locale = locale;
      coseyLocale.value = coseyLangs[locale];
      dayjs.locale(dayjsLangs[locale]);
      localStorage.setItem(langKey, locale);

      document.documentElement.style.direction = rtlLangs.includes(locale) ? 'rtl' : 'ltr';
    },
    {
      immediate: true,
    },
  );

  app.use(i18n);
}

export const localOptions = [
  { label: '简体中文', value: 'zh-cn' },
  { label: 'English', value: 'en' },
  { label: 'العربية', value: 'ar' },
];
