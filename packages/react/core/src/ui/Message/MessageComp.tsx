import {className as compMessageClassName} from '../../../../../shared/src/ui/Message/create';
import {
    directionClassName as compMessageDirectionClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewDirectionClassName';
import {
    statusClassName as compMessageStatusClassName,
} from '../../../../../shared/src/ui/Message/utils/applyNewStatusClassName';
import {LoaderComp} from '../Loader/LoaderComp';
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

    if (props.status === 'loading') {
        const loader = props.loader ?? <LoaderComp/>;
        return (
            <div className={className}>
                {loader}
            </div>
        );
    }

    if (props.status === 'error') {
        return (
            <div className={className}>
                Error
            </div>
        );
    }

    const message = typeof props.message === 'function' ? props.message() : props.message;

    // TODO - Handle markdown rendering
    return (
        <div className={className}>
            {message}
        </div>
    );
};
