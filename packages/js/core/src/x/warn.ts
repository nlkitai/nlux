export const warn = (message: any) => {
    if (typeof message === 'string') {
        console.warn(`[nlux] ${message}`);
        return;
    }

    if (message && typeof message.toString === 'function') {
        console.warn(`[nlux] ${message.toString()}`);
        return;
    }

    console.warn('[nlux]');
    console.log(JSON.stringify(message, null, 2));
};

const warnedMessages: string[] = [];
export const warnOnce = (message: string) => {
    if (warnedMessages.includes(message)) {
        return;
    }

    warnedMessages.push(message);
    warn(message);
};
