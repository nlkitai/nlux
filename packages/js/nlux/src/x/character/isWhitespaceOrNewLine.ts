export const isWhitespaceOrNewLine = (character: string): boolean => {
    return /^[ \t\n]{1}$/.test(character);
};
