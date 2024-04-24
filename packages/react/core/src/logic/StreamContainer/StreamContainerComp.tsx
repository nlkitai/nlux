import {Ref, useImperativeHandle, useRef} from 'react';
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
    const streamContainer = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: string) => {
            streamContainer.current?.append(
                // TODO - Handle markdown
                document.createTextNode(chunk),
            );
        },
    }), []);

    const compDirectionClassName = compMessageDirectionClassName['incoming'];
    const compStatusClassName = compMessageStatusClassName[props.status];
    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;

    return (
        <div className={className} ref={streamContainer}/>
    );
};
