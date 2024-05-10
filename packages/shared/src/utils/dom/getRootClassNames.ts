const rootClassName = 'nlux-AiChat-root';
const defaultThemeId = 'nova';

export const getRootClassNames = (props: {
    themeId?: string;
    className?: string;
    [key: string]: any;
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
