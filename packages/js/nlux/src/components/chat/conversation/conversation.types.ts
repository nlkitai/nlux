import {CompMessageProps} from '../message/message.types';

export type CompConversationEvents = 'user-scrolled';

export type CompConversationProps = Readonly<{
    messages?: CompMessageProps[];
    scrollWhenGenerating?: boolean;
}>;

export type CompConversationElements = Readonly<{
    messagesContainer: HTMLElement;
}>;

export type CompConversationActions = Readonly<{
    scrollToBottom: () => void;
}>;
