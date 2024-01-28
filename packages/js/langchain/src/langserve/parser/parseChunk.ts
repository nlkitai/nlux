import {parseStreamedEvent} from './parseStreamedEvent';

export const parseChunk = (chunk: string): Array<{
    event: 'data' | 'end';
    data: any;
}> | Error => {
    if (!chunk) {
        return [];
    }

    // Extract the line that contains the event name
    const regEx = /(((?<=^)|(?<=\n))event:\s+(\w+))/g;
    const eventStartPositions: number[] = [];
    let match = regEx.exec(chunk);
    while (match) {
        eventStartPositions.push(match.index);
        match = regEx.exec(chunk);
    }

    const extractEvent = (startPosition: number, index: number) => {
        const endPosition = eventStartPositions[index + 1] || chunk.length;
        return chunk.substring(startPosition, endPosition);
    };

    try {
        return eventStartPositions
            .map(extractEvent)
            .map(parseStreamedEvent)
            .filter(event => event !== undefined)
            .map(event => event!);
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }

        // When no error is thrown, we return empty result
        return [];
    }
};
