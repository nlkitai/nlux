import {PromptBoxProps} from '../../../../../../shared/src/ui/PromptBox/props';
import {BaseComp} from '../../../exports/aiChat/comp/base';
import {CompEventListener, Model} from '../../../exports/aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {renderChatbox} from './prompt-box.render';
import {
    CompPromptBoxActions,
    CompPromptBoxElements,
    CompPromptBoxEventListeners,
    CompPromptBoxEvents,
    CompPromptBoxProps,
} from './prompt-box.types';
import {updateChatbox} from './prompt-box.update';

@Model('prompt-box', renderChatbox, updateChatbox)
export class CompPromptBox<MessageType> extends BaseComp<
    MessageType, CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxActions
> {

    private userEventListeners?: CompPromptBoxEventListeners;

    constructor(context: ControllerContext<MessageType>, {props, eventListeners}: {
        props: CompPromptBoxProps,
        eventListeners?: CompPromptBoxEventListeners
    }) {
        super(context, props);
        this.userEventListeners = eventListeners;
    }

    public focusTextInput() {
        this.executeDomAction('focusTextInput');
    }

    @CompEventListener('command-enter-key-pressed')
    handleCommandEnterKeyPressed(event?: KeyboardEvent) {
        const submitShortcut = this.getProp('domCompProps')?.submitShortcut;
        if (submitShortcut === 'CommandEnter') {
            this.handleSendButtonClick();
            event?.preventDefault();
        }
    }

    @CompEventListener('enter-key-pressed')
    handleEnterKeyPressed(event?: KeyboardEvent) {
        const submitShortcut = this.getProp('domCompProps')?.submitShortcut;
        if (!submitShortcut || submitShortcut === 'Enter') {
            this.handleSendButtonClick();
            event?.preventDefault();
        }
    }

    @CompEventListener('send-message-clicked')
    handleSendButtonClick() {
        const domCompProps = this.getProp('domCompProps');
        if (domCompProps?.disableSubmitButton) {
            return;
        }

        const message = domCompProps?.message;
        if (!message) {
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

        const currentCompProps = this.getProp('domCompProps') as PromptBoxProps;
        this.setDomProps({
            ...currentCompProps,
            message: newValue,
        });
    }

    @CompEventListener('text-updated')
    handleTextInputUpdated(event: Event) {
        const target = event.target;
        if (!(target instanceof HTMLTextAreaElement)) {
            return;
        }

        this.handleTextChange(target.value);
    }

    public setDomProps(props: PromptBoxProps) {
        this.setProp('domCompProps', props);
    }
}
