import {createPromptBoxDom} from '../../../comp/PromptBox/create';
import {NluxRenderingError} from '../../../core/error';
import {CompRenderer} from '../../../types/comp';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {domOp} from '../../../x/domOp';
import {source} from '../../../x/source';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxProps} from './prompt-box.types';

export const renderChatbox: CompRenderer<
    CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxActions
> = ({
    appendToRoot,
    props,
    compEvent,
}) => {
    const promptBoxRoot = createPromptBoxDom(props.domCompProps);

    appendToRoot(promptBoxRoot);

    const [textBoxElement, removeTextBoxListeners] = listenToElement(promptBoxRoot, ':scope > textarea')
        .on('input', compEvent('text-updated'))
        .on('keydown', (event: KeyboardEvent) => {
            if (!event.shiftKey && event.key === 'Enter') {
                compEvent('enter-key-pressed')();
                event.preventDefault();
                return;
            }

            if (event.key === 'Escape') {
                compEvent('escape-key-pressed')();
                event.preventDefault();
                return;
            }
        }).get();

    const [sendButtonElement, removeSendButtonListeners] = listenToElement(promptBoxRoot, ':scope > button')
        .on('click', compEvent('send-message-clicked')).get();

    if (!(sendButtonElement instanceof HTMLButtonElement)) {
        throw new Error('Expected a button element');
    }

    if (!(textBoxElement instanceof HTMLTextAreaElement)) {
        throw new NluxRenderingError({
            source: source('prompt-box', 'render'),
            message: 'Expected a textarea element',
        });
    }

    const focusTextInput = () => domOp(() => {
        textBoxElement.focus();
        textBoxElement.setSelectionRange(textBoxElement.value.length, textBoxElement.value.length);
    });

    return {
        elements: {
            root: promptBoxRoot,
            textInput: textBoxElement,
            sendButton: sendButtonElement,
        },
        actions: {
            focusTextInput,
        },
        onDestroy: () => {
            removeTextBoxListeners();
            removeSendButtonListeners();
        },
    };
};
