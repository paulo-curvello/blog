// src/lib/i18n.ts
export const SUPPORTED_LANGS = ['pt', 'en'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: Lang = 'pt';
export const dict = { pt: { home:'Início', blog:'Blog', latestPosts:'Posts recentes' },
                      en: { home:'Home', blog:'Blog', latestPosts:'Latest posts' } } as const;
