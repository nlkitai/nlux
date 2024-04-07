import {className as messageDomClassName} from '@nlux-dev/core/src/ui/Message/create';
import {directionClassName} from '@nlux-dev/core/src/ui/Message/utils/applyNewDirectionClassName';
import {statusClassName} from '@nlux-dev/core/src/ui/Message/utils/applyNewStatusClassName';
import {Ref, useEffect, useImperativeHandle, useRef} from 'react';
import {StreamContainerImperativeProps, StreamContainerProps} from './props';
import {streamingDomService} from './streamingDomServive';

export const StreamContainerComp = (
    props: StreamContainerProps,
    ref: Ref<StreamContainerImperativeProps>,
) => {
    const streamContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (streamContainer.current) {
            streamContainer.current.appendChild(streamingDomService.getStreamingDomElement(props.uid));
        } else {
            streamingDomService.deleteStreamingDomElement(props.uid);
        }
    }, [streamContainer.current]);

    useEffect(() => {
        return () => {
            streamingDomService.deleteStreamingDomElement(props.uid);
        };
    }, []);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: string) => {
            const domById = streamingDomService.getStreamingDomElement(props.uid);
            domById?.append(
                // TODO — Handle proper streaming
                document.createTextNode(chunk),
            );
        },
    }), []);

    const compDirectionClassName = props.direction
        ? directionClassName[props.direction]
        : directionClassName['incoming'];

    const compStatusClassName = props.status
        ? statusClassName[props.status]
        : statusClassName['rendered'];

    const className = `${messageDomClassName} ${compStatusClassName} ${compDirectionClassName}`;

    return (
        <div className={className} ref={streamContainer}/>
    );
};
