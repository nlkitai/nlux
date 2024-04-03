import {statusClassName} from '@nlux-dev/core/src/comp/PromptBox/utils/applyNewStatusClassName';
import {compPromptBoxClassName} from '@nlux/core';
import React from 'react';
import {LoaderComp} from '../Loader/LoaderComp';
import {SendIconComp} from '../SendIcon/SendIconComp';
import {PromptBoxProps} from './props';

export const PromptBoxComp = (props: PromptBoxProps) => {
    const compClassNameFromStats = statusClassName[props.status] || '';
    const className = `${compPromptBoxClassName} ${compClassNameFromStats}`;

    const disableTextarea = props.status === 'submitting';
    const disableButton = !props.canSubmit || props.status === 'submitting' || props.status === 'waiting';
    const showSendIcon = props.status === 'typing';

    return (
        <div className={className}>
            <textarea
                disabled={disableTextarea}
                placeholder={props.placeholder ?? ''}
                value={props.prompt ?? ''}
                onChange={(e) => props.onChange?.(e.target.value)}
                onFocus={() => props.onFocus?.()}
            />
            <button
                disabled={disableButton}
                onClick={() => props.onSubmit?.()}
            >
                {showSendIcon && <SendIconComp/>}
                {!showSendIcon && <LoaderComp/>}
            </button>
        </div>
    );
};
