import {ConvoPit as ConvoPitType, createConvoPit} from '@nlux/nlux';
import React, {useEffect, useRef, useState} from 'react';
import {handleNewPropsReceived} from './handleNewPropsReceived';
import {ConvoPitProps} from './props';

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
            layoutOptions,
            conversationOptions,
            promptBoxOptions,
        } = props;

        let newInstance = createConvoPit().withAdapter(adapter);

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
        <div ref={rootElement}></div>
    );
};
