import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStore } from '@/web/store/local';
import { builtInLocales, englishLocale } from '@/web/i18n/locales';
import { formatMessage, normalizeMessageKey } from '@/web/i18n/translate';

const LOCALE_KEY = 'locale';

function normalizePack(pack: typeof englishLocale) {
  const messages: Record<string, string> = {};
  for (const [key, value] of Object.entries(pack.messages)) {
    messages[normalizeMessageKey(key)] = value;
  }
  return {
    code: pack.code,
    name: pack.name,
    messages,
  };
}

function getPacks() {
  return builtInLocales.map(normalizePack);
}

export const useI18nStore = defineStore('i18n', () => {
  const localStore = useLocalStore();
  const currentCode = ref(loadSavedCode());

  const locales = computed(() => getPacks());

  const current = computed(() => {
    return locales.value.find((pack) => pack.code === currentCode.value) ?? locales.value[0];
  });

  function loadSavedCode(): string {
    try {
      const saved = localStore.get(LOCALE_KEY) as { code?: string } | null;
      if (saved && typeof saved.code === 'string' && getPacks().some((pack) => pack.code === saved.code)) {
        return saved.code;
      }
    } catch {
      // empty
    }
    return englishLocale.code;
  }

  function t(key: string, ...args: Array<string | number>): string {
    const normalized = normalizeMessageKey(key);
    const pack = builtInLocales.find((item) => item.code === currentCode.value) ?? englishLocale;
    const translated = normalizePack(pack).messages[normalized] ?? normalized;
    return formatMessage(translated, args);
  }

  function setLocale(code: string): void {
    if (!getPacks().some((pack) => pack.code === code)) {
      return;
    }
    currentCode.value = code;
    localStore.set(LOCALE_KEY, { code });
  }

  return {
    currentCode,
    current,
    locales,
    t,
    setLocale,
  };
});
