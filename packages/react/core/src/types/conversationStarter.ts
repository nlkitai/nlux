import {JSX} from 'react';

/**
 * This represents a single item displayed in the chat UI while the conversation has not started yet.
 *
 */
export type ConversationStarter = {
    /**
     * The prompt to type in the composer input and submit to start the conversation.
     */
    prompt: string;

    /**
     * An optional label to display inside the conversation starter option button.
     */
    label?: string;

    /**
     * An optional icon to display inside the conversation starter option button.
     * This could either be a URL to an image or a JSX element.
     */
    icon?: string | JSX.Element;
};
