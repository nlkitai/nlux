import {HighlighterExtension} from '@nlux/core';
import {FC} from 'react';
import {ChatItemProps} from '../ChatItem/props';

const MarkdownRenderer = (props: {
    initialMarkdownMessage?: string,
    markdownOptions?: {
        syntaxHighlighter?: HighlighterExtension,
        openLinksInNewWindow?: boolean,
    },
}) => {
    // TODO - Implement markdown parsing in one go (no streaming)
    // Use-cases : Messages loaded from history, etc.
    const {initialMarkdownMessage} = props;
    return <>{initialMarkdownMessage ? initialMarkdownMessage : ''}</>;
};

export const createMessageRenderer: <AiMsg>(props: ChatItemProps<AiMsg>) => FC<void> = function <AiMsg>(props: ChatItemProps<AiMsg>) {
    const {
        message,
        customRenderer,
    } = props;

    if (customRenderer !== undefined) {
        if (message === undefined) {
            return () => null;
        }

        return () => customRenderer!({
            message: message as AiMsg,
        });
    }

    if (typeof message === 'string') {
        const messageToRender: string = message;
        return () => <MarkdownRenderer initialMarkdownMessage={messageToRender}/>;
    }

    // No custom renderer and message is not a string!
    return () => '';
};
