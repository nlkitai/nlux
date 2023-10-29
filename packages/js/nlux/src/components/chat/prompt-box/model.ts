import {BaseComp} from '../../../core/comp/base';
import {CompEventListener, Model} from '../../../core/comp/decorators';
import {renderChatbox} from './render';
import {
    CompPromptBoxActions,
    CompPromptBoxElements,
    CompPromptBoxEventListeners,
    CompPromptBoxEvents,
    CompPromptBoxProps,
} from './types';
import {updateChatbox} from './update';

@Model('prompt-box', renderChatbox, updateChatbox)
export class CompChatbox extends BaseComp<CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxActions> {

    private userEventListeners?: CompPromptBoxEventListeners;

    constructor(instanceId: string, props: CompPromptBoxProps, eventListeners?: CompPromptBoxEventListeners) {
        super(instanceId, props);
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
            this.setProp('enableSendButton', false);
        } else {
            this.setProp('enableSendButton', true);
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

    public resetTextInput() {
        this.handleTextChange('');
    }
}
