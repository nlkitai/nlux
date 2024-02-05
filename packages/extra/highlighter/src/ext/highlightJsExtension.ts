import {CreateHighlighterOptions, Highlighter, HighlighterColorMode, HighlighterExtension, warn} from '@nlux/core';
import hljs from 'highlight.js/lib/common';

import {languageAliases} from '../highlightJs/languages';

const createExtension = (): HighlighterExtension => {
    const defaultColorMode: HighlighterColorMode = 'dark';
    let colorModeBeingUsed: HighlighterColorMode = defaultColorMode;

    const setColorMode = (colorMode: HighlighterColorMode) => {
        colorModeBeingUsed = colorMode;
    };

    for (const [alias, language] of Object.entries(languageAliases)) {
        if (!hljs.getLanguage(language)) {
            warn(`Language "${language}" is not registered to use with highlight.js.`);
        } else {
            hljs.registerAliases(alias, {
                languageName: language,
            });
        }
    }

    const highlighterFunction: Highlighter = (code: string, language: string) => {
        const result = hljs.highlight(code, {
            language: language,
            ignoreIllegals: true,
        });

        return result.value;
    };

    return {
        createHighlighter(options?: CreateHighlighterOptions): Highlighter {
            const {
                colorMode,
            } = options ?? {};

            setColorMode(colorMode ?? defaultColorMode);
            return highlighterFunction;
        },
        highlightingClass(language?: string): string {
            return colorModeBeingUsed === 'light' ? 'highlighter-light' : 'highlighter-dark';
        },
    };
};

export const highlightJsExtension: HighlighterExtension = createExtension();
