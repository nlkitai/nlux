import {ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef} from 'react';
import {className as compComposerClassName} from '@shared/components/Composer/create';
import {
    statusClassName as compComposerStatusClassName,
} from '@shared/components/Composer/utils/applyNewStatusClassName';
import {LoaderComp} from '../Loader/LoaderComp';
import {SendIconComp} from '../SendIcon/SendIconComp';
import {ComposerProps} from './props';

export const ComposerComp = (props: ComposerProps) => {
    const compClassNameFromStats = compComposerStatusClassName[props.status] || '';
    const className = `${compComposerClassName} ${compClassNameFromStats}`;

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
                tabIndex={0}
                ref={textareaRef}
                disabled={disableTextarea}
                placeholder={props.placeholder}
                value={props.prompt}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <button
                tabIndex={0}
                disabled={disableButton}
                onClick={() => props.onSubmit?.()}
            >
                {showSendIcon && <SendIconComp/>}
                {!showSendIcon && <LoaderComp/>}
            </button>
        </div>
    );
};
