export const toKebabCase = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
