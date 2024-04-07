import {compExceptionsBoxClassName} from '@nlux/core';
import React from 'react';
import {ExceptionsBoxProps} from './props';

export const ExceptionsBoxComp = (props: ExceptionsBoxProps) => {
    return (
        <div className={compExceptionsBoxClassName}>{props.message}</div>
    );
};
