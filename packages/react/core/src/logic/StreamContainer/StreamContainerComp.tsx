import {Ref, useEffect, useImperativeHandle, useRef} from 'react';
import {className as compMessageClassName} from '../../../../../shared/src/ui/Message/create';
import {
    directionClassName as compMessageDirectionClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewDirectionClassName';
import {
    statusClassName as compMessageStatusClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewStatusClassName';
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
        ? compMessageDirectionClassName[props.direction]
        : compMessageDirectionClassName['incoming'];

    const compStatusClassName = props.status
        ? compMessageStatusClassName[props.status]
        : compMessageStatusClassName['rendered'];

    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;

    return (
        <div className={className} ref={streamContainer}/>
    );
};
