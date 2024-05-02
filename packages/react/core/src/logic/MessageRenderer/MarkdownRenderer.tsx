import {useEffect, useRef, useState} from 'react';
import {
    createMarkdownStreamParser,
    MarkdownStreamParser,
    MarkdownStreamParserOptions,
} from '../../../../../extra/markdown/src';
import {streamingDomService} from '../StreamContainer/streamingDomService';

export const MarkdownRenderer = (props: {
    messageUid: string,
    content: string,
    markdownOptions?: MarkdownStreamParserOptions,
}) => {
    const {markdownOptions} = props;

    // We use references in this component to avoid re-renders — as streaming happens outside of React
    // rendering cycle, we don't want to trigger re-renders on every chunk of data received.
    const rootElRef = useRef<HTMLDivElement | null>(null);
    const rootElRefPreviousValue = useRef<HTMLDivElement | null>(null);

    const [streamContainer, setStreamContainer] = useState<HTMLDivElement>();
    const mdStreamParserRef = useRef<MarkdownStreamParser | null>(null);

    useEffect(() => {
        if (rootElRef.current !== rootElRefPreviousValue.current) {
            rootElRefPreviousValue.current = rootElRef.current;
            setStreamContainer(rootElRef.current || undefined);
        }
    }); // No dependencies, this effect should run on every render.
    // The 'if' statement inside the effect plays a similar role to a useEffect dependency array
    // to prevent setting the streamContainer state to the same value multiple times.

    useEffect(() => {
        if (streamContainer) {
            const element = streamingDomService.getStreamingDomElement(props.messageUid);
            streamContainer.append(element);
        }
    }, [streamContainer]);

    useEffect(() => {
        const element = streamingDomService.getStreamingDomElement(props.messageUid);
        if (!element.innerHTML) {
            mdStreamParserRef.current = createMarkdownStreamParser(element, {
                ...markdownOptions,
                skipAnimation: true,
            });

            mdStreamParserRef.current?.next(props.content);
        }

        return () => {
            // Technical — The DOM element will be re-used if the same message (with the same UID) is re-rendered
            // in the chat segment. This is handled by the streamingDomService.
            streamingDomService.deleteStreamingDomElement(props.messageUid);
        };
    }, [markdownOptions?.syntaxHighlighter, markdownOptions?.openLinksInNewWindow]);

    return <div className={'nlux-md-strm-root'} ref={rootElRef}/>;
};
