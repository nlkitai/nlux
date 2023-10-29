import {NluxRenderingError} from '../../../core/error';
import {listenToElement} from '../../../dom/listenToElement';
import {CompRenderer} from '../../../types/comp';
import {render} from '../../../x/render.ts';
import {source} from '../../../x/source.ts';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxProps} from './types';

const __ = (styleName: string) => `nluxc-prompt-box-${styleName}`;

const html = (props: CompPromptBoxProps) => `` +
    `<textarea` + ` ` +
    `class="nluxc-textarea ${__('text-input')}"` + ` ` +
    `placeholder="${props.placeholder || ''}"` + ` ` +
    `${!props.enableTextInput ? `disabled="disabled"` : ``}` + ` ` +
    `${props.autoFocus ? 'autofocus="autofocus"' : ''}` + ` ` +
    `>${props.textInputValue ?? ''}</textarea>` +
    `<button` + ` ` +
    `class="bt-primary-filled ${__('send-button')}"` + ` ` +
    `${!props.enableSendButton ? `disabled="disabled"` : ``}` +
    `>` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">` +
    `<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" ` +
    `fill="currentColor"` +
    `stroke-linejoin="round" ` +
    `stroke-linecap="round" ` +
    `/>` +
    `</svg>` +
    `</button>`;

export const renderChatbox: CompRenderer<
    CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxActions
> = ({
    appendToRoot,
    props,
    compEvent,
}) => {
    const dom = render(html(props));
    if (!dom) {
        throw new NluxRenderingError({
            source: source('prompt-box', 'render'),
            message: 'Prompt box could not be rendered',
        });
    }

    const promptBoxRoot = document.createElement('div');
    promptBoxRoot.append(dom);
    promptBoxRoot.className = __('container');

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

    const focusTextInput = () => requestAnimationFrame(() => {
        textBoxElement.focus();
        textBoxElement.setSelectionRange(textBoxElement.value.length, textBoxElement.value.length);
    });

    const onPromptBoxClick = (event: MouseEvent) => {
        focusTextInput();
        event.stopPropagation();
        event.preventDefault();
    };

    promptBoxRoot.addEventListener('click', onPromptBoxClick);

    return {
        elements: {
            textInput: textBoxElement,
            sendButton: sendButtonElement,
        },
        actions: {
            focusTextInput,
        },
        onDestroy: () => {
            removeTextBoxListeners();
            removeSendButtonListeners();
            promptBoxRoot.removeEventListener('click', onPromptBoxClick);
        },
    };
};
