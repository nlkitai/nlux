import {isSubmitShortcutKey} from '@shared/utils/isSubmitShortcutKey';
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
        if (isSubmitShortcutKey(e, props.submitShortcut)) {
            e.preventDefault();
            handleSubmit();
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
                {!showSendIcon && props.Loader}
            </button>
        </div>
    );
};
