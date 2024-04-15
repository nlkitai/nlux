export const isLineBreakSequence = (sequence: string): boolean => {
    return /^[ \t]{2}\n$/m.test(sequence);
};
