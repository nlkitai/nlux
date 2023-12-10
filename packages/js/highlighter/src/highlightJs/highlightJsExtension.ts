import {CreateHighlighterOptions, Highlighter, HighlighterColorMode, HighlighterExtension, warn} from '@nlux/nlux';
import hljs from 'highlight.js/lib/core';
import {LanguageName, languages, languageShortcutToNameMap} from './languages';

const createExtension = (): HighlighterExtension => {
    const registeredLanguages: LanguageName[] = [];
    const defaultColorMode: HighlighterColorMode = 'dark';
    let colorModeBeingUsed: HighlighterColorMode = defaultColorMode;

    const setColorMode = (colorMode: HighlighterColorMode) => {
        colorModeBeingUsed = colorMode;
    };

    const highlighterFunction: Highlighter = (code: string, language: string) => {
        const lowerCaseLanguage = language.toLowerCase();
        const languageStandardName: LanguageName | undefined = languages[lowerCaseLanguage as LanguageName]
            ? lowerCaseLanguage as LanguageName
            : languageShortcutToNameMap[lowerCaseLanguage];

        if (!languageStandardName) {
            warn(`Language "${language}" is not supported by NLUX's highlight plugin implementation. ` +
                `You can create a custom plugin to support it. Ref NLUX's documentation for more details.`);

            return code;
        }

        if (!registeredLanguages.includes(languageStandardName)) {
            hljs.registerLanguage(
                languageStandardName,
                languages[languageStandardName as LanguageName],
            );

            registeredLanguages.push(languageStandardName);
        }

        const result = hljs.highlight(code, {
            language: languageStandardName,
            ignoreIllegals: true,
        });

        return result.value;
    };

    return {
        createHighlighter(options?: CreateHighlighterOptions): Highlighter {
            const {
                colorMode,
            } = options ?? {};

            for (const language of Object.keys(languages)) {
                const languageStandardName: LanguageName = language as LanguageName;
                if (registeredLanguages.includes(languageStandardName)) {
                    continue;
                }

                hljs.registerLanguage(language, languages[languageStandardName]);
                registeredLanguages.push(languageStandardName);
            }

            setColorMode(colorMode ?? defaultColorMode);

            return highlighterFunction;
        },
        highlightingClass(language?: string): string {
            return colorModeBeingUsed === 'light' ? 'highlighter-light' : 'highlighter-dark';
        },
    };
};

export const highlightJsExtension: HighlighterExtension = createExtension();
