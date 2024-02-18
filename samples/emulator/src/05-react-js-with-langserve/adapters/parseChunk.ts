type EventFromChunk = {
    event: string;
    data?: string;
};

const parseEvent = (event: string): EventFromChunk | undefined => {
    const regEx = /^event:\s+(?<event>[\w]+)(\ndata: (?<data>[\W\w]*$)){0,1}/g;
    const match = regEx.exec(event);
    if (!match) {
        return undefined;
    }

    const {event: eventName, data} = match.groups || {};
    if (!eventName) {
        return undefined;
    }

    return {event: eventName, data};
};

const parseEventData = (eventData: string): {[key: string]: any} | undefined => {
    try {
        return JSON.parse(eventData);
    } catch (e) {
        return undefined;
    }
};

export const parseChunk = (chunk: any): Array<any> | Error | undefined => {
    if (typeof chunk !== 'string' || !chunk) {
        return undefined;
    }

    // Extract the line that contains the event name
    const regEx = /((?<=(\n*|^))event:\s+(\w+)\n)/g;
    const eventStartPositions: number[] = [];
    let match = regEx.exec(chunk);
    while (match) {
        eventStartPositions.push(match.index);
        match = regEx.exec(chunk);
    }

    const eventChunks = eventStartPositions
        .map((startPosition, index) => {
            const endPosition = eventStartPositions[index + 1] || chunk.length;
            return chunk.substring(startPosition, endPosition);
        })
        .map(parseEvent)
        .filter((event) => event !== undefined)
        .map((event) => event!)
        .filter((event) => event.event === 'data')
        .map((event) => event.data)
        .filter((data) => data !== undefined)
        .map((data) => data!)
        .map(parseEventData)
        .filter((data) => data !== undefined)
        .map((data) => data!)
        .map((data) => data.content as string | undefined)
        .filter((data) => data !== undefined)
        .map((data) => data!);

    return eventChunks;
};
