import {className as compMessageClassName} from '@shared/components/Message/create';
import {
    directionClassName as compMessageDirectionClassName,
} from '@shared/components/Message/utils/applyNewDirectionClassName';
import {statusClassName as compMessageStatusClassName} from '@shared/components/Message/utils/applyNewStatusClassName';
import {MessageProps} from './props';

export const MessageComp = function (props: MessageProps) {
    const compStatusClassName = props.status
        ? compMessageStatusClassName[props.status]
        : compMessageStatusClassName['rendered'];

    const compDirectionClassName = props.direction
        ? compMessageDirectionClassName[props.direction]
        : compMessageDirectionClassName['received'];

    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;

    if (props.status === 'streaming') {
        // When streaming, the message is not rendered — As content is streamed in real-time and appended
        // to the DOM directly.
        return (
            <div className={className}/>
        );
    }

    // When the message is complete, render the message content.
    // If the message is a function, it means that it's a custom message renderer.
    const message = typeof props.message === 'function' ? <props.message/> : props.message;

    return (
        <div className={className}>
            {message}
        </div>
    );
};
