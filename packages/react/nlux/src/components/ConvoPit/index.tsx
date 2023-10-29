import {ConvoPit as ConvoPitType, createConvoPit} from '@nlux/nlux';
import React, {useEffect, useRef, useState} from 'react';
import {handleNewPropsReceived} from './handleNewPropsReceived.ts';
import {ConvoPitProps} from './props.ts';

export const ConvoPit = (props: Readonly<ConvoPitProps>) => {
    const {className} = props;
    const rootElement = useRef<HTMLDivElement>(null);
    const [currentProps, setCurrentProps] = useState<Readonly<ConvoPitProps> | null>(null);
    const convoPit = useRef<ConvoPitType | null>(null);

    useEffect(() => {
        if (!rootElement.current) {
            throw new Error('Root element is not defined');
        }

        const {
            adapter,
            containerMaxHeight,
            theme,
            messageOptions,
            conversationOptions,
            promptBoxOptions,
        } = props;

        let newInstance = createConvoPit().withAdapter(adapter);

        if (containerMaxHeight) {
            newInstance = newInstance.withContainerMaxHeight(containerMaxHeight);
        }

        if (theme) {
            newInstance = newInstance.withTheme(theme);
        }

        if (promptBoxOptions) {
            newInstance = newInstance.withPromptBoxOptions(promptBoxOptions);
        }

        if (messageOptions) {
            newInstance = newInstance.withMessageOptions(messageOptions);
        }

        if (conversationOptions) {
            newInstance = newInstance.withConversationOptions(conversationOptions);
        }

        newInstance.mount(rootElement.current);
        convoPit.current = newInstance;

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
                'Adapter passed to <ConvoPit /> component cannot be changed. '
                + 'Make sure you use React\s useMemo hook to memoize the adapter instance.',
            );
        }

        if (convoPit.current) {
            handleNewPropsReceived(convoPit.current, currentProps, props);
        }
    }, [props]);

    return (
        <div ref={rootElement} className={className}></div>
    );
};
