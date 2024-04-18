export const stringifyRandomResponse = (randomResponse: any): string => {
    if (typeof randomResponse === 'string') {
        return randomResponse;
    }

    if (typeof randomResponse === 'object') {
        return `${randomResponse}`;
    }

    if (randomResponse === null || randomResponse === undefined) {
        return '';
    }

    if (typeof randomResponse.toString === 'function') {
        return randomResponse.toString();
    }

    return JSON.stringify(randomResponse);
};
