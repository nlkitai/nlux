import {ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef} from 'react';
import {className as compComposerClassName} from '@shared/components/Composer/create';
import {
    statusClassName as compComposerStatusClassName,
} from '@shared/components/Composer/utils/applyNewStatusClassName';
import {SendIconComp} from '../../components/SendIcon/SendIconComp';
import {ComposerProps} from './props';

export const ComposerComp = (props: ComposerProps) => {
    const compClassNameFromStats = compComposerStatusClassName[props.status] || '';
    const className = `${compComposerClassName} ${compClassNameFromStats}`;

    const disableTextarea = props.status === 'submitting-conversation-starter' || props.status === 'submitting-prompt';
    const disableButton = !props.hasValidInput || props.status === 'submitting-conversation-starter' || props.status === 'submitting-prompt' || props.status === 'waiting';
    const showSendIcon = props.status === 'typing';

    const textInputRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (props.status === 'typing' && props.autoFocus && textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [props.status, props.autoFocus, textInputRef.current]);

    const handleChange = useMemo(() => (e: ChangeEvent<HTMLDivElement>) => {
        props.onChange?.(e.currentTarget.innerText ?? "");
    }, [props.onChange]);

    const handleSubmit = useMemo(() => () => {
        props.onSubmit?.();
    }, [props.onSubmit]);

    const handleKeyDown = useMemo(() => (e: KeyboardEvent<HTMLDivElement>) => {
        if (!props.submitShortcut || props.submitShortcut === 'Enter') {
            const isEnter = e.key === 'Enter';
            const aModifierKeyIsPressed = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
            if (isEnter && !aModifierKeyIsPressed) {
                handleSubmit();
                e.preventDefault();
            }

            return;
        }

        if (props.submitShortcut === 'CommandEnter') {
            const isCommandEnter = e.key === 'Enter' && (
                e.getModifierState('Control') || e.getModifierState('Meta')
            );

            if (isCommandEnter) {
                handleSubmit();
                e.preventDefault();
            }
        }
    }, [handleSubmit, props.submitShortcut]);

    return (
        <div className={className}>
            <div 
            tabIndex={0}
            ref={textInputRef}
            contentEditable={!disableTextarea}
            // Don't use onInput , it causes weird behavior
            onBlur={handleChange}
            onKeyDown={handleKeyDown}
            data-placeholder={props.placeholder}
            >   
            {props.prompt}
            </div>
            <button
                tabIndex={0}
                disabled={disableButton}
                onClick={() => props.onSubmit?.()}
            >
                {showSendIcon && <SendIconComp/>}
                {!showSendIcon && props.Loader}
            </button>
        </div>
    );
};
