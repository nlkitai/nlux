import {CompTextMessageProps} from '../text-message/types.ts';

export type CompConversationEvents = 'user-scrolled';

export type CompConversationProps = Readonly<{
    messages?: CompTextMessageProps[];
    autoScrollOnGenerate?: boolean;
}>;

export type CompConversationEventListeners = Partial<{}>;

export type CompConversationElements = Readonly<{
    messagesContainer: HTMLElement;
}>;

export type CompConversationActions = Readonly<{}>;
