const rootClassName = 'nlux-AiChat-root';
const defaultThemeId = 'nova';

export const getSystemColorScheme = () => {
    if (typeof globalThis !== undefined && globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)')?.matches) {
        return 'dark';
    }

    return 'light';
};

export const getRootClassNames = (props: {
    themeId?: string;
    className?: string;
}): string[] => {
    const result = [rootClassName];
    const themeId = props.themeId || defaultThemeId;
    const themeClassName = `nlux-theme-${themeId}`;

    result.push(themeClassName);

    if (props.className) {
        result.push(props.className);
    }

    return result;
};
