import {ComposerProps} from '@shared/components/Composer/props';
import {BaseComp} from '../../../aiChat/comp/base';
import {CompEventListener, Model} from '../../../aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {renderChatbox} from './composer.render';
import {
    CompComposerActions,
    CompComposerElements,
    CompComposerEventListeners,
    CompComposerEvents,
    CompComposerProps,
} from './composer.types';
import {updateChatbox} from './composer.update';

@Model('composer', renderChatbox, updateChatbox)
export class CompComposer<AiMsg> extends BaseComp<
    AiMsg, CompComposerProps, CompComposerElements, CompComposerEvents, CompComposerActions
> {

    private userEventListeners?: CompComposerEventListeners;

    constructor(context: ControllerContext<AiMsg>, {props, eventListeners}: {
        props: CompComposerProps,
        eventListeners?: CompComposerEventListeners
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

        const currentCompProps = this.getProp('domCompProps') as ComposerProps;
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

    public setDomProps(props: ComposerProps) {
        this.setProp('domCompProps', props);
    }
}
