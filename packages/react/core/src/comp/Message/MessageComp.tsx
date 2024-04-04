import {className as messageDomClassName} from '@nlux-dev/core/src/comp/Message/create';
import {directionClassName} from '@nlux-dev/core/src/comp/Message/utils/applyNewDirectionClassName';
import {statusClassName} from '@nlux-dev/core/src/comp/Message/utils/applyNewStatusClassName';
import React from 'react';
import {LoaderComp} from '../Loader/LoaderComp';
import {MessageProps} from './props';

export const MessageComp = (props: MessageProps) => {
    const compStatusClassName = props.status
        ? statusClassName[props.status]
        : statusClassName['rendered'];

    const compDirectionClassName = props.direction
        ? directionClassName[props.direction]
        : directionClassName['incoming'];

    const className = `${messageDomClassName} ${compStatusClassName} ${compDirectionClassName}`;

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

    // TODO - Handle markdown rendering
    return (
        <div className={className}>
            {props.message}
        </div>
    );
};
