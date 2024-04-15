export const debug = (message: string, ...args: any[]) => {
    if (process.env.NLUX_DEBUG_ENABLED === 'true') {
        console.log(`[DEBUG] ${message}`, ...args);
    }
};
