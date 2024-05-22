import {CallbackFunction} from '../../../../../../shared/src/types/callbackFunction';
import {NluxRenderingError} from '../../../../../../shared/src/types/error';
import {createComposerDom} from '../../../../../../shared/src/ui/Composer/create';
import {domOp} from '../../../../../../shared/src/utils/dom/domOp';
import {CompRenderer} from '../../../types/comp';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {source} from '../../../utils/source';
import {CompComposerActions, CompComposerElements, CompComposerEvents, CompComposerProps} from './composer.types';

export const renderChatbox: CompRenderer<
    CompComposerProps, CompComposerElements, CompComposerEvents, CompComposerActions
> = ({
    appendToRoot,
    props,
    compEvent,
}) => {
    const composerRoot = createComposerDom(props.domCompProps);

    appendToRoot(composerRoot);

    const [textBoxElement, removeTextBoxListeners] = listenToElement(composerRoot, ':scope > textarea')
        .on('input', compEvent('text-updated'))
        .on('keydown', ((event: KeyboardEvent) => {
            const isEnter = event.key === 'Enter';
            const aModifierKeyIsPressed = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
            if (isEnter && !aModifierKeyIsPressed) {
                compEvent('enter-key-pressed')(event);
                return;
            }

            const isCommandEnter = event.getModifierState('Meta') && event.key === 'Enter';
            const isControlEnter = event.getModifierState('Control') && event.key === 'Enter';
            if (isCommandEnter || isControlEnter) {
                compEvent('command-enter-key-pressed')(event);
                return;
            }
        }) as CallbackFunction).get();

    const [sendButtonElement, removeSendButtonListeners] = listenToElement(composerRoot, ':scope > button')
        .on('click', compEvent('send-message-clicked')).get();

    if (!(sendButtonElement instanceof HTMLButtonElement)) {
        throw new Error('Expected a button element');
    }

    if (!(textBoxElement instanceof HTMLTextAreaElement)) {
        throw new NluxRenderingError({
            source: source('composer', 'render'),
            message: 'Expected a textarea element',
        });
    }

    const focusTextInput = () => domOp(() => {
        textBoxElement.focus();
        textBoxElement.setSelectionRange(textBoxElement.value.length, textBoxElement.value.length);
    });

    return {
        elements: {
            root: composerRoot,
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
