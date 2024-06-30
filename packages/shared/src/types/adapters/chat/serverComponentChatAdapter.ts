import {ChatAdapterExtras} from './chatAdapterExtras';

/**
 * The result of an import() call that loads a React Server Component (RSC) from the server.
 */
export type StreamedServerComponent = {
    default: Function;
};

/**
 * The props that are passed to the server component it's used with useAsRscAdapter().
 * - `message`: The message that was sent to the API.
 * - `extras`: The extras object that was passed to the adapter.
 */
export type StreamedServerComponentProps = {
    message: string;
    extras: ChatAdapterExtras;
};

/**
 * The function used to send a message to the backend hosting the React Server Component (RSC) and
 * get a React Server Component in return.
 */
export type StreamSendServerComponent<AiMsg = string> = (
    message: string,
    extras: ChatAdapterExtras<AiMsg>,
    events: {
        onServerComponentReceived: () => void;
        onError: (error: Error) => void;
    },
) => () => void;

/**
 * Adapter used to submit a message to the API and get a response in the form of an ESM module.
 * This is used to load React Server Components (RSCs) in the chat and is only used in the @nlux/react package
 * to enable `ChatAdapter.streamServerComponent` method.
 */
export interface ServerComponentChatAdapter<AiMsg = string> {
    streamServerComponent: StreamSendServerComponent<AiMsg>;
}
