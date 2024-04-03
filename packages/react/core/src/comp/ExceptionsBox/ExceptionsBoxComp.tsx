import {className} from '@nlux-dev/core/src/comp/ExceptionsBox/create';
import React from 'react';
import {ExceptionsBoxProps} from './props';

export const ExceptionsBoxComp = (props: ExceptionsBoxProps) => {
    return (
        <div className={className}>{props.message}</div>
    );
};
