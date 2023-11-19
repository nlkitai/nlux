export const isWhitespace = (character: string): boolean => {
    return /^[ \t]{1}$/.test(character);
};
