export type Highlighter = (input: string, language: string) => string;

export type HighlighterColorMode = 'dark' | 'light';

export type CreateHighlighterOptions = {
    language?: string;
    colorMode?: HighlighterColorMode;
};

export interface HighlighterExtension {
    createHighlighter(options?: CreateHighlighterOptions): Highlighter;
    highlightingClass(language?: string): string;
}
