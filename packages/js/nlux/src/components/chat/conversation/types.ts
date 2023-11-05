import {CompTextMessageProps} from '../text-message/types';

export type CompConversationEvents = 'user-scrolled';

export type CompConversationProps = Readonly<{
    messages?: CompTextMessageProps[];
    scrollWhenGenerating?: boolean;
}>;

export type CompConversationEventListeners = Partial<{}>;

export type CompConversationElements = Readonly<{
    messagesContainer: HTMLElement;
}>;

export type CompConversationActions = Readonly<{}>;
