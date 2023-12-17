import {AiChat as AiChatType, createAiChat} from '@nlux/core';
import React, {useEffect, useRef, useState} from 'react';
import {handleNewPropsReceived} from './handleNewPropsReceived';
import {AiChatProps} from './props';

export const AiChat = (props: Readonly<AiChatProps>) => {
    const rootElement = useRef<HTMLDivElement>(null);
    const [currentProps, setCurrentProps] = useState<Readonly<AiChatProps> | null>(null);
    const aiChat = useRef<AiChatType | null>(null);

    useEffect(() => {
        if (!rootElement.current) {
            throw new Error('Root element is not defined');
        }

        const {
            adapter,
            className,
            syntaxHighlighter,
            layoutOptions,
            conversationOptions,
            promptBoxOptions,
        } = props;

        let newInstance = createAiChat().withAdapter(adapter);

        if (layoutOptions) {
            newInstance = newInstance.withLayoutOptions(layoutOptions);
        }

        if (promptBoxOptions) {
            newInstance = newInstance.withPromptBoxOptions(promptBoxOptions);
        }

        if (conversationOptions) {
            newInstance = newInstance.withConversationOptions(conversationOptions);
        }

        if (className) {
            newInstance = newInstance.withClassName(className);
        }

        if (syntaxHighlighter) {
            newInstance = newInstance.withSyntaxHighlighter(syntaxHighlighter);
        }

        newInstance.mount(rootElement.current);
        aiChat.current = newInstance;

        return () => {
            newInstance?.unmount();
        };
    }, []);

    useEffect(() => {
        if (!currentProps) {
            setCurrentProps(props);
            return;
        }

        if (currentProps.adapter !== props.adapter) {
            throw new Error(
                'Adapter passed to <AiChat /> component cannot be changed. '
                + 'Make sure you use React\s useMemo hook to memoize the adapter instance.',
            );
        }

        if (aiChat.current) {
            handleNewPropsReceived(aiChat.current, currentProps, props);
        }
    }, [props]);

    return (
        <div ref={rootElement}></div>
    );
};
