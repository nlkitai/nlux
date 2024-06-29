import {ComposerStatus} from '@shared/components/Composer/props';
import {isSubmitShortcutKey} from '@shared/utils/isSubmitShortcutKey';
import {ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef} from 'react';
import {className as compComposerClassName} from '@shared/components/Composer/create';
import {
    statusClassName as compComposerStatusClassName,
} from '@shared/components/Composer/utils/applyNewStatusClassName';
import {CancelIconComp} from '../../components/CancelIcon/CancelIconComp';
import {SendIconComp} from '../../components/SendIcon/SendIconComp';
import {ComposerProps} from './props';

const submittingPromptStatuses: Array<ComposerStatus> = [
    'submitting-prompt',
    'submitting-edit',
    'submitting-conversation-starter',
    'submitting-external-message',
];

export const ComposerComp = (props: ComposerProps) => {
    const compClassNameFromStats = compComposerStatusClassName[props.status] || '';
    const className = `${compComposerClassName} ${compClassNameFromStats}`;

    const disableTextarea = submittingPromptStatuses.includes(props.status);
    const disableButton = !props.hasValidInput || props.status === 'waiting' || submittingPromptStatuses.includes(props.status);
    const showSendIcon = props.status === 'typing' || props.status === 'waiting';
    const hideCancelButton = props.hideStopButton === true;
    const showCancelButton = !hideCancelButton && (submittingPromptStatuses.includes(props.status) || props.status === 'waiting');

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
            {!showCancelButton && (
                <button
                    tabIndex={0}
                    disabled={disableButton}
                    onClick={() => props.onSubmit()}
                >
                    {showSendIcon && <SendIconComp/>}
                    {!showSendIcon && props.Loader}
                </button>
            )}
            {showCancelButton && (
                <button
                    tabIndex={0}
                    onClick={props.onCancel}
                >
                    <CancelIconComp/>
                </button>
            )}
        </div>
    );
};
