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
    // TODO - Implement markdown parsing
    const {initialMarkdownMessage} = props;
    return <div className={'markdown-NOT-parsed'}>{initialMarkdownMessage}</div>;
};

export const createMessageRenderer: <AiMsg>(props: ChatItemProps<AiMsg>) => FC<void> = function <AiMsg>(props: ChatItemProps<AiMsg>) {
    if (props.customRenderer !== undefined) {
        if (props.message === undefined) {
            return () => null;
        }

        return () => props.customRenderer!({
            message: props.message as AiMsg,
        });
    }

    if (typeof props.message === 'string') {
        const messageToRender: string = props.message;
        return () => <MarkdownRenderer initialMarkdownMessage={messageToRender}/>;
    }

    // No custom renderer and message is not a string!
    return () => '';
};
