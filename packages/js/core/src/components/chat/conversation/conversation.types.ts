import {CompMessageProps} from '../message/message.types';

export type CompConversationEvents = 'user-scrolled';

export type CompConversationScrollParams = Readonly<{
    scrolledToBottom: boolean;
    scrollDirection: 'up' | 'down' | undefined;
}>;

export type CompConversationScrollCallback = (params: CompConversationScrollParams) => void;

export type CompConversationProps = Readonly<{
    messages?: CompMessageProps[];
    scrollWhenGenerating: boolean;
}>;

export type CompConversationElements = Readonly<{
    messagesContainer: HTMLElement;
}>;

export type CompConversationActions = Readonly<{
    scrollToBottom: () => void;
}>;
