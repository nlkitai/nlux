/**
 * This represents a set of extra data that can be sent to the context adapter.
 * It can be used by implementations to send additional data such as authentication headers.
 */
export type ContextAdapterExtras = {
    /**
     * This contains the headers that implementers can use to send additional data such as authentication headers.
     */
    headers?: Record<string, string>;
};
