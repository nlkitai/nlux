import {BaseComp} from '../../../core/aiChat/comp/base';
import {CompEventListener, Model} from '../../../core/aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {renderChatbox} from './prompt-box.render';
import {
    CompPromptBoxActions,
    CompPromptBoxButtonStatus,
    CompPromptBoxElements,
    CompPromptBoxEventListeners,
    CompPromptBoxEvents,
    CompPromptBoxProps,
} from './prompt-box.types';
import {updateChatbox} from './prompt-box.update';

@Model('prompt-box', renderChatbox, updateChatbox)
export class CompPromptBox extends BaseComp<CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxActions> {

    private userEventListeners?: CompPromptBoxEventListeners;

    constructor(context: ControllerContext, {props, eventListeners}: {
        props: CompPromptBoxProps,
        eventListeners?: CompPromptBoxEventListeners
    }) {
        super(context, props);
        this.userEventListeners = eventListeners;
    }

    public enableTextInput(enable = true) {
        this.setProp('enableTextInput', enable);

        if (enable) {
            this.focusTextInput();
        }
    }

    public focusTextInput() {
        this.executeDomAction('focusTextInput');
    }

    @CompEventListener('enter-key-pressed')
    handleEnterKeyPressed() {
        this.handleSendButtonClick();
    }

    @CompEventListener('escape-key-pressed')
    handleEscapeKeyPressed() {
        this.handleTextChange('');
    }

    @CompEventListener('send-message-clicked')
    handleSendButtonClick() {
        if (!this.getProp('textInputValue')) {
            return;
        }

        const callback = this.userEventListeners?.onSubmit;
        if (callback) {
            callback();
        }
    }

    handleTextChange(newValue: string) {
        const callback = this.userEventListeners?.onTextUpdated;
        if (callback) {
            callback(newValue);
        }

        const oldValue = this.getProp('textInputValue') as string | undefined;
        if (newValue !== oldValue) {
            this.setProp('textInputValue', newValue);
        }

        if (newValue === '') {
            this.setProp('sendButtonStatus', 'disabled');
        } else {
            this.setProp('sendButtonStatus', 'enabled');
        }
    }

    @CompEventListener('text-updated')
    handleTextInputUpdated(event: Event) {
        const target = event.target;
        if (!(target instanceof HTMLTextAreaElement)) {
            return;
        }

        this.handleTextChange(target.value);
    }

    public resetSendButtonStatus() {
        if (this.getProp('textInputValue') === '') {
            this.setProp('sendButtonStatus', 'disabled');
        } else {
            this.setProp('sendButtonStatus', 'enabled');
        }
    }

    public resetTextInput() {
        this.handleTextChange('');
    }

    public setSendButtonStatus(newStatus: CompPromptBoxButtonStatus) {
        this.setProp('sendButtonStatus', newStatus);
    }
}
