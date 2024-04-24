import {createMarkdownStreamParser, MarkdownStreamParser} from '@nlux/markdown';
import {Ref, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {className as compMessageClassName} from '../../../../../shared/src/ui/Message/create';
import {
    directionClassName as compMessageDirectionClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewDirectionClassName';
import {
    statusClassName as compMessageStatusClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewStatusClassName';
import {StreamContainerImperativeProps, StreamContainerProps} from './props';
import {streamingDomService} from './streamingDomService';

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
    const rootElRef = useRef<HTMLDivElement | null>(null);
    const rootElRefPreviousValue = useRef<HTMLDivElement | null>(null);
    const mdStreamParserRef = useRef<MarkdownStreamParser | null>(null);

    const [streamContainer, setStreamContainer] = useState<HTMLDivElement>();
    const [initialMarkdownMessageParsed, setInitialMarkdownMessageParsed] = useState(false);

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
            const element = streamingDomService.getStreamingDomElement(props.uid);
            streamContainer.append(element);
        }
    }, [streamContainer]);

    useEffect(() => {
        const element = streamingDomService.getStreamingDomElement(props.uid);
        mdStreamParserRef.current = createMarkdownStreamParser(element, {
            openLinksInNewWindow: markdownOptions?.openLinksInNewWindow ?? true,
            syntaxHighlighter: markdownOptions?.syntaxHighlighter ?? undefined,
        });

        if (!initialMarkdownMessageParsed && initialMarkdownMessage) {
            mdStreamParserRef.current.next(initialMarkdownMessage);
            setInitialMarkdownMessageParsed(true);
        }

        return () => {
            // Technical — The DOM element will be re-used if the same message (with the same UID) is re-rendered
            // in the chat segment. This is handled by the streamingDomService.
            streamingDomService.deleteStreamingDomElement(props.uid);
        };
    }, [markdownOptions?.openLinksInNewWindow, markdownOptions?.syntaxHighlighter]);

    useEffect(() => {
        return () => {
            rootElRefPreviousValue.current = null;
            mdStreamParserRef.current?.complete();
            mdStreamParserRef.current = null;
            setStreamContainer(undefined);
        };
    }, []);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: string) => mdStreamParserRef.current?.next(chunk),
        completeStream: () => mdStreamParserRef.current?.complete(),
    }), []);

    const compDirectionClassName = compMessageDirectionClassName['incoming'];
    const compStatusClassName = compMessageStatusClassName[status];
    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;

    return (
        <div className={className}>
            <div className={'nlux-md-strm-root'} ref={rootElRef}/>
        </div>
    );
};
