import {compMessageClassName, compMessageDirectionClassName, compMessageStatusClassName} from '@nlux/core';
import React from 'react';
import {LoaderComp} from '../Loader/LoaderComp';
import {MessageProps} from './props';

export const MessageComp = (props: MessageProps) => {
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

    // TODO - Handle markdown rendering
    return (
        <div className={className}>
            {props.message}
        </div>
    );
};
