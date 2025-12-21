// i18n 설정 - 다국어 지원
// 한국어, 영어, 일본어 지원

import ko from './ko';
import en from './en';
import ja from './ja';

export type Locale = 'ko' | 'en' | 'ja';

// 번역 데이터
const translations = {
    ko,
    en,
    ja,
} as const;

// 기본 언어
export const defaultLocale: Locale = 'ko';

// 지원 언어 목록
export const locales: Locale[] = ['ko', 'en', 'ja'];

// 언어 이름
export const localeNames: Record<Locale, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
};

// 언어 플래그 이모지
export const localeFlags: Record<Locale, string> = {
    ko: '🇰🇷',
    en: '🇺🇸',
    ja: '🇯🇵',
};

// 브라우저 언어 감지
export function detectLocale(): Locale {
    if (typeof window === 'undefined') return defaultLocale;

    const browserLang = navigator.language.split('-')[0];
    if (locales.includes(browserLang as Locale)) {
        return browserLang as Locale;
    }
    return defaultLocale;
}

// 저장된 언어 가져오기
export function getSavedLocale(): Locale {
    if (typeof window === 'undefined') return defaultLocale;

    const saved = localStorage.getItem('locale');
    if (saved && locales.includes(saved as Locale)) {
        return saved as Locale;
    }
    return detectLocale();
}

// 언어 저장
export function saveLocale(locale: Locale): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('locale', locale);
    }
}

// 번역 가져오기
export function getTranslation(locale: Locale = defaultLocale) {
    return translations[locale];
}

// 중첩 키 접근 (예: 'common.loading')
export function t(locale: Locale, key: string): string {
    const translation = translations[locale];
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = translation;

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            return key; // 키를 찾지 못하면 원본 반환
        }
    }

    return typeof result === 'string' ? result : key;
}

export { ko, en, ja };
