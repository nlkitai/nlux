export const predefinedContextSize = {
    '1k': 1000,
    '10k': 10000,
    '100k': 100000,
    '1mb': 1000000,
    '10mb': 10000000,
};

/**
 * Context data synchronization options.
 */
export type DataSyncOptions = {
    /**
     * Data synchronization strategy.
     * - `auto` - Batch updates and automatically sync the context data.
     * - `lazy` - Only sync when the user is about to send a message.
     *
     * Default: `auto`
     */
    syncStrategy?: 'auto' | 'lazy';

    /**
     * The maximum size of the context data to be allowed and synced.
     * When the limit is reached, the oldest data will be removed.
     *
     * Default: `10kb`
     */
    contextSize?: number;
};
