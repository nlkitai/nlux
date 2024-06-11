const rootClassName = 'nlux-AiChat-root';
const defaultThemeId = 'nova';

const getSystemColorScheme = () => {
    if (typeof globalThis !== undefined && globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)')?.matches) {
        return 'dark';
    }

    return 'light';
};

export const getRootClassNames = (props: {
    themeId?: string;
    className?: string;
    colorScheme?: 'light' | 'dark' | 'auto';
    transparentBackground?: boolean;
}): string[] => {
    const result = [rootClassName];
    const themeId = props.themeId || defaultThemeId;
    const themeClassName = `nlux-theme-${themeId}`;

    const colorSchemaToUse = props.colorScheme || 'auto';
    const colorSchemeToApply = colorSchemaToUse === 'auto' ? getSystemColorScheme() : colorSchemaToUse;
    const colorSchemeClassName = `nlux-colorScheme-${colorSchemeToApply}`;

    result.push(themeClassName);
    result.push(colorSchemeClassName);

    if (props.className) {
        result.push(props.className);
    }

    if (props.transparentBackground) {
        result.push('nlux-transparentBackground');
    }

    return result;
};
