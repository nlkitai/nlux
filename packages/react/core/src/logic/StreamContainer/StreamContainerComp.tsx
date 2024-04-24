import {createMarkdownStreamParser, MarkdownStreamParser} from '@nlux/markdown';
import {Ref, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {className as compMessageClassName} from '../../../../../shared/src/ui/Message/create';
import {
    directionClassName as compMessageDirectionClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewDirectionClassName';
import {
    statusClassName as compMessageStatusClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewStatusClassName';
import {StreamContainerImperativeProps, StreamContainerProps} from './props';

export const StreamContainerComp = (
    props: StreamContainerProps,
    ref: Ref<StreamContainerImperativeProps>,
) => {
    const {
        status,
        markdownOptions,
        initialMarkdownMessage,
    } = props;

    // We use references in this component to avoid re-renders — as streaming happens outside of React
    // rendering cycle, we don't want to trigger re-renders on every chunk of data received.
    const streamContainerRef = useRef<HTMLDivElement | null>(null);
    const streamContainerRefPreviousValue = useRef<HTMLDivElement | null>(null);
    const markdownStreamParserRef = useRef<MarkdownStreamParser | null>(null);

    const [streamContainer, setStreamContainer] = useState<HTMLDivElement>();
    const markdownElement = useMemo(() => {
        const element = document.createElement('div');
        element.className = 'nlux-msg-md';
        return element;
    }, []);

    const [initialMarkdownMessageParsed, setInitialMarkdownMessageParsed] = useState(false);

    useEffect(() => {
        if (streamContainerRef.current !== streamContainerRefPreviousValue.current) {
            streamContainerRefPreviousValue.current = streamContainerRef.current;
            setStreamContainer(streamContainerRef.current || undefined);
        }
    }); // No dependencies, this effect should run on every render
    // The 'if' statement inside the effect plays a similar role to a useEffect dependency array
    // to prevent setting the streamContainer state to the same value multiple times.

    useEffect(() => {
        if (streamContainer) {
            streamContainer.append(markdownElement);
        } else {
            const fragment = document.createDocumentFragment();
            fragment.append(markdownElement);
        }
    });

    useEffect(() => {
        markdownStreamParserRef.current = createMarkdownStreamParser(markdownElement, {
            openLinksInNewWindow: markdownOptions?.openLinksInNewWindow ?? true,
            syntaxHighlighter: markdownOptions?.syntaxHighlighter ?? undefined,
        });

        if (!initialMarkdownMessageParsed && initialMarkdownMessage) {
            markdownStreamParserRef.current.next(initialMarkdownMessage);
            setInitialMarkdownMessageParsed(true);
        }
    }, [markdownOptions?.openLinksInNewWindow, markdownOptions?.syntaxHighlighter]);

    useEffect(() => {
        return () => {
            streamContainerRefPreviousValue.current = null;
            markdownStreamParserRef.current?.complete();
            markdownStreamParserRef.current = null;
            setStreamContainer(undefined);
        };
    }, []);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: string) => markdownStreamParserRef.current?.next(chunk),
        completeStream: () => markdownStreamParserRef.current?.complete(),
    }), []);

    const compDirectionClassName = compMessageDirectionClassName['incoming'];
    const compStatusClassName = compMessageStatusClassName[status];
    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;

    return (
        <div className={className} ref={streamContainerRef}/>
    );
};
