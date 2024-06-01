import {debug} from '@shared/utils/debug';
import {warn} from '@shared/utils/warn';

export const parseStreamedEvent = (event: string): {
    event: 'data' | 'end';
    data: unknown;
} | undefined => {
    const regEx = /^event:\s+(?<event>[\w]+)((\r?)\n(\r?)data: (?<data>(.|\n)*))?/gm;
    const match = regEx.exec(event);
    if (!match) {
        return undefined;
    }

    const {event: eventName, data: rawData} = match.groups || {};
    if (!eventName) {
        return undefined;
    }

    if (eventName !== 'data' && eventName !== 'end') {
        debug(`LangServe stream adapter received unsupported event "${eventName}"`);
        return undefined;
    }

    try {
        const data = rawData ? JSON.parse(rawData) : undefined;
        return {event: eventName, data};
    } catch (_error) {
        warn(`LangServe stream adapter failed to parse data for chunk event "${eventName}" | Data: ${rawData}`);
        return {event: eventName, data: undefined};
    }
};
