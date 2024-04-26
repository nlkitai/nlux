import {FC} from 'react';
import {ChatItemProps} from '../../ui/ChatItem/props';
import {MarkdownRenderer} from './MarkdownRenderer';

export const createMessageRenderer: <AiMsg>(props: ChatItemProps<AiMsg>) => FC<void> = function <AiMsg>(props: ChatItemProps<AiMsg>) {
    const {
        message,
        customRenderer,
        direction,
    } = props;

    if (customRenderer !== undefined) {
        if (message === undefined) {
            return () => null;
        }

        return () => customRenderer!({
            message: message as AiMsg,
        });
    }

    if (direction === 'outgoing') {
        if (typeof message === 'string') {
            const messageToRender: string = message;
            return () => <>{messageToRender}</>;
        }

        return () => '';
    }

    if (typeof message === 'string') {
        const messageToRender: string = message;
        return () => (
            <MarkdownRenderer
                messageUid={props.uid}
                content={messageToRender}
                markdownOptions={{
                    syntaxHighlighter: props.syntaxHighlighter,
                    openLinksInNewWindow: props.openLinksInNewWindow,
                }}
            />
        );
    }

    // No custom renderer and message is not a string!
    return () => '';
};
