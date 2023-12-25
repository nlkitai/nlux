import {AiChat as AiChatType, createAiChat, warn} from '@nlux/core';
import React, {useEffect, useRef, useState} from 'react';
import {reactPersonasToCorePersonas} from '../../utils/reactPersonasToCorePersonas';
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

        let shouldMount = true;

        const {
            adapter,
            className,
            syntaxHighlighter,
            layoutOptions,
            conversationOptions,
            promptBoxOptions,
            personaOptions,
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

        if (personaOptions) {
            reactPersonasToCorePersonas(personaOptions).then((corePersonas) => {
                newInstance = newInstance.withPersonaOptions(corePersonas);
                if (!shouldMount) {
                    return;
                }

                if (!rootElement.current) {
                    warn('Root element is not defined! AiChat cannot be mounted.');
                    return;
                }

                newInstance.mount(rootElement.current);
                aiChat.current = newInstance;
            });
        } else {
            newInstance.mount(rootElement.current);
            aiChat.current = newInstance;
        }

        return () => {
            shouldMount = false;
            newInstance?.unmount();
        };
    }, []);

    useEffect(() => {
        let isUseEffectCancelled = false;

        if (!currentProps) {
            setCurrentProps(props);
            return;
        }

        if (aiChat.current) {
            handleNewPropsReceived(currentProps, props).then((newProps) => {
                if (isUseEffectCancelled || !newProps) {
                    return;
                }

                if (!aiChat.current) {
                    warn('AiChat is not defined! Cannot update.');
                    return;
                }

                setCurrentProps(props);
                aiChat.current.updateProps(newProps);
            });
        }

        return () => {
            isUseEffectCancelled = true;
        };
    }, [props, currentProps]);

    return (
        <div ref={rootElement}></div>
    );
};
