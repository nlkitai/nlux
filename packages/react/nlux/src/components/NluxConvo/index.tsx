import {createConvo, NluxConvo as NluxConvoType} from '@nlux/nlux';
import React, {useEffect, useRef, useState} from 'react';
import {handleNewPropsReceived} from './handleNewPropsReceived';
import {NluxConvoProps} from './props';

export const NluxConvo = (props: Readonly<NluxConvoProps>) => {
    const rootElement = useRef<HTMLDivElement>(null);
    const [currentProps, setCurrentProps] = useState<Readonly<NluxConvoProps> | null>(null);
    const nluxConvo = useRef<NluxConvoType | null>(null);

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

        let newInstance = createConvo().withAdapter(adapter);

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
        nluxConvo.current = newInstance;

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
                'Adapter passed to <NluxConvo /> component cannot be changed. '
                + 'Make sure you use React\s useMemo hook to memoize the adapter instance.',
            );
        }

        if (nluxConvo.current) {
            handleNewPropsReceived(nluxConvo.current, currentProps, props);
        }
    }, [props]);

    return (
        <div ref={rootElement}></div>
    );
};
