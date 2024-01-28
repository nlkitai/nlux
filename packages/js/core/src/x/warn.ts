export const warn = (message: any) => {
    const prefix = (process.env.NLUX_DEBUG_ENABLED === 'true')
        ? '[nlux]: '
        : '';

    if (typeof message === 'string') {
        console.warn(`${prefix}${message}`);
    } else {
        prefix && console.warn(prefix);
        console.log(JSON.stringify(message, null, 2));
    }
};

const warnedMessages: string[] = [];
export const warnOnce = (message: string) => {
    if (warnedMessages.includes(message)) {
        return;
    }

    warnedMessages.push(message);
    warn(message);
};
