import {className as compMessageClassName} from '../../../../../shared/src/ui/Message/create';
import {
    directionClassName as compMessageDirectionClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewDirectionClassName';
import {
    statusClassName as compMessageStatusClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewStatusClassName';
import {MessageProps} from './props';

export const MessageComp = function <AiMsg>(props: MessageProps<AiMsg>) {
    const compStatusClassName = props.status
        ? compMessageStatusClassName[props.status]
        : compMessageStatusClassName['rendered'];

    const compDirectionClassName = props.direction
        ? compMessageDirectionClassName[props.direction]
        : compMessageDirectionClassName['incoming'];

    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;

    if (props.status === 'streaming') {
        return (
            <div className={className}/>
        );
    }

    const message = typeof props.message === 'function' ? props.message() : props.message;

    return (
        <div className={className}>
            {message}
        </div>
    );
};
