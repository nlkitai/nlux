import {compPromptBoxClassName, compPromptBoxStatusClassName} from '@nlux/core';
import React, {useMemo} from 'react';
import {LoaderComp} from '../Loader/LoaderComp';
import {SendIconComp} from '../SendIcon/SendIconComp';
import {PromptBoxProps} from './props';

export const PromptBoxComp = (props: PromptBoxProps) => {
    const compClassNameFromStats = compPromptBoxStatusClassName[props.status] || '';
    const className = `${compPromptBoxClassName} ${compClassNameFromStats}`;

    const disableTextarea = props.status === 'submitting';
    const disableButton = !props.hasValidInput || props.status === 'submitting' || props.status === 'waiting';
    const showSendIcon = props.status === 'typing';

    const handleChange = useMemo(() => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange?.(e.target.value);
    }, [props.onChange]);

    const handleKeyDown = useMemo(() => (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!props.submitShortcut || props.submitShortcut === 'Enter') {
            const isEnter = e.key === 'Enter';
            const aModifierKeyIsPressed = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
            if (isEnter && !aModifierKeyIsPressed) {
                props.onSubmit?.();
            }
        } else {
            if (props.submitShortcut === 'CommandEnter') {
                const isCommandEnter = e.key === 'Enter' && (
                    e.getModifierState('Control') || e.getModifierState('Meta')
                );

                if (isCommandEnter) {
                    props.onSubmit?.();
                }
            }
        }
    }, [props.onSubmit, props.submitShortcut]);

    return (
        <div className={className}>
            <textarea
                disabled={disableTextarea}
                placeholder={props.placeholder}
                value={props.prompt}
                autoFocus={props.autoFocus}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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
