import {ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef} from 'react';
import {className as compPromptBoxClassName} from '../../../../../shared/src/ui/PromptBox/create';
import {
    statusClassName as compPromptBoxStatusClassName,
} from '../../../../../shared/src/ui/PromptBox/utils/applyNewStatusClassName';
import {LoaderComp} from '../Loader/LoaderComp';
import {SendIconComp} from '../SendIcon/SendIconComp';
import {PromptBoxProps} from './props';

export const PromptBoxComp = (props: PromptBoxProps) => {
    const compClassNameFromStats = compPromptBoxStatusClassName[props.status] || '';
    const className = `${compPromptBoxClassName} ${compClassNameFromStats}`;

    const disableTextarea = props.status === 'submitting';
    const disableButton = !props.hasValidInput || props.status === 'submitting' || props.status === 'waiting';
    const showSendIcon = props.status === 'typing';

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (props.status === 'typing' && props.autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [props.status, props.autoFocus, textareaRef.current]);

    const handleChange = useMemo(() => (e: ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange?.(e.target.value);
    }, [props.onChange]);

    const handleSubmit = useMemo(() => () => {
        props.onSubmit?.();
    }, [props.onSubmit]);

    const handleKeyDown = useMemo(() => (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
            <textarea
                ref={textareaRef}
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
