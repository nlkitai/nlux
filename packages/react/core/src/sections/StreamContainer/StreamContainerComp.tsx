import {Ref, RefObject, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {className as compMessageClassName} from '@shared/components/Message/create';
import {
    directionClassName as compMessageDirectionClassName,
} from '@shared/components/Message/utils/applyNewDirectionClassName';
import {statusClassName as compMessageStatusClassName} from '@shared/components/Message/utils/applyNewStatusClassName';
import {ResponseRenderer} from '../../exports/messageOptions';
import {StreamContainerImperativeProps, StreamContainerProps} from './props';
import {streamingDomService} from './streamingDomService';
import {createMdStreamRenderer} from '@shared/markdown/stream/streamParser';
import {StandardStreamParserOutput} from '@shared/types/markdown/streamParser';

export const StreamContainerComp = function <AiMsg>(
    props: StreamContainerProps<AiMsg>,
    ref: Ref<StreamContainerImperativeProps<AiMsg>>,
) {
    const {
        uid,
        status,
        responseRenderer,
        markdownOptions,
        initialMarkdownMessage,
    } = props;

    const [content, setContent] = useState<Array<AiMsg>>([]);

    // We use references in this component to avoid re-renders — as streaming happens outside of React
    // rendering cycle, we don't want to trigger re-renders on every chunk of data received.
    const rootElRef = useRef<HTMLDivElement | null>(null);
    const rootElRefPreviousValue = useRef<HTMLDivElement | null>(null);
    const mdStreamParserRef = useRef<StandardStreamParserOutput | null>(null);
    const appendChunkToStateRef = useRef<((newContent: AiMsg) => void) | null>(null);

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
            const element = streamingDomService.getStreamingDomElement(uid);
            streamContainer.append(element);
        }
    }, [streamContainer]);

    useEffect(() => {
        appendChunkToStateRef.current = (newContent: AiMsg) => {
            setContent((prevContent) => [...prevContent, newContent]);
        };
    }, [setContent]);

    // We update the stream parser when key options (markdownLinkTarget, syntaxHighlighter, etc.) change.
    useEffect(() => {
        const element = streamingDomService.getStreamingDomElement(uid);
        mdStreamParserRef.current = createMdStreamRenderer(element, {
            syntaxHighlighter: markdownOptions?.syntaxHighlighter,
            htmlSanitizer: markdownOptions?.htmlSanitizer,
            markdownLinkTarget: markdownOptions?.markdownLinkTarget,
            showCodeBlockCopyButton: markdownOptions?.showCodeBlockCopyButton,
            skipStreamingAnimation: markdownOptions?.skipStreamingAnimation,
            streamingAnimationSpeed: markdownOptions?.streamingAnimationSpeed,
        });

        if (!initialMarkdownMessageParsed && initialMarkdownMessage) {
            mdStreamParserRef.current.next(initialMarkdownMessage);
            setInitialMarkdownMessageParsed(true);
        }

        return () => {
            // Technical — The DOM element will be re-used if the same message (with the same UID) is re-rendered
            // in the chat segment. This is handled by the streamingDomService.
            streamingDomService.deleteStreamingDomElement(uid);
        };
    }, [
        markdownOptions?.syntaxHighlighter,
        markdownOptions?.htmlSanitizer,
        markdownOptions?.markdownLinkTarget,
        markdownOptions?.showCodeBlockCopyButton,
        markdownOptions?.skipStreamingAnimation,
        markdownOptions?.streamingAnimationSpeed,
    ]);

    useEffect(() => {
        return () => {
            rootElRefPreviousValue.current = null;
            mdStreamParserRef.current = null;
            appendChunkToStateRef.current = null;
            setStreamContainer(undefined);
        };
    }, []);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: AiMsg) => {
            // This will append the chunk to the state
            const appendChunkToState = appendChunkToStateRef.current;
            if (appendChunkToState) {
                appendChunkToStateRef.current?.(chunk);
            }

            if (typeof chunk === 'string') {
                mdStreamParserRef.current?.next(chunk);
            }
        },
        completeStream: () => {
            mdStreamParserRef.current?.complete();
        },
    }), []);

    const compDirectionClassName = compMessageDirectionClassName['received'];
    const compStatusClassName = compMessageStatusClassName[status];
    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;
    const StreamResponseRendererComp = responseRenderer ? responseRenderer as ResponseRenderer<AiMsg> : undefined;

    return <div className={className}>
        {StreamResponseRendererComp && (
            <StreamResponseRendererComp
                uid={uid}
                status={status}
                containerRef={rootElRef as RefObject<never>}
                content={content}
                serverResponse={[]}
                dataTransferMode={'stream'}
            />
        )}
        {!StreamResponseRendererComp && (
            <div className={'nlux-markdownStream-root'} ref={rootElRef}/>
        )}
    </div>;
};
