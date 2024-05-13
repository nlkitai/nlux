export const uid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
        const randomValue = Math.random() * 16 | 0;
        const value = character == 'x' ? randomValue : (randomValue & 0x3 | 0x8);
        return value.toString(16);
    });
};
