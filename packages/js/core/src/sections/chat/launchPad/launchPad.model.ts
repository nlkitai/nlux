import {BaseComp} from '../../../aiChat/comp/base';
import {Model} from '../../../aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {renderLaunchPad} from './launchPad.renderer';
import {CompLaunchPadActions, CompLaunchPadElements, CompLaunchPadEvents, CompLaunchPadProps} from './launchPad.types';
import {updateLaunchPad} from './launchPad.update';
import {ConversationStarter} from '../../../types/conversationStarter';
import {comp} from '../../../aiChat/comp/comp';
import {CompConversationStarters} from '../conversationStarters/conversationStarters.model';
import {CompConversationStartersProps} from '../conversationStarters/conversationStarters.types';
import {AssistantPersona} from '../../../aiChat/options/personaOptions';

@Model('launchPad', renderLaunchPad, updateLaunchPad)
export class CompLaunchPad<AiMsg> extends BaseComp<
    AiMsg,
    CompLaunchPadProps,
    CompLaunchPadElements,
    CompLaunchPadEvents,
    CompLaunchPadActions
> {
    private conversationStartersComp: CompConversationStarters<AiMsg> | undefined;

    constructor(context: ControllerContext<AiMsg>, props: CompLaunchPadProps) {
        super(context, props);
        this.setConversationStarters(props.conversationStarters);
    }

    public setConversationStarters(conversationStarters: ConversationStarter[] | undefined) {
        if (!conversationStarters && !this.conversationStartersComp) {
            return;
        }

        if (conversationStarters && !this.conversationStartersComp) {
            const onConversationStarterSelected = this.getProp(
                'onConversationStarterSelected',
            ) as CompLaunchPadProps['onConversationStarterSelected'];

            this.conversationStartersComp = comp(CompConversationStarters<AiMsg>)
                .withContext(this.context)
                .withProps({
                    conversationStarters,
                    onConversationStarterSelected,
                } satisfies CompConversationStartersProps)
                .create();

            this.addSubComponent(
                this.conversationStartersComp.id,
                this.conversationStartersComp,
                'conversationStartersContainer',
            );

            return;
        }

        if (!conversationStarters && this.conversationStartersComp) {
            this.removeSubComponent(this.conversationStartersComp.id);
            this.conversationStartersComp = undefined;
        } else {
            this.conversationStartersComp?.updateConversationStarters(conversationStarters);
        }
    }

    public setShowGreeting(showGreeting: boolean) {
        this.setProp('showGreeting', showGreeting);
        this.executeDomAction('resetGreeting', showGreeting);
    }

    public setAssistantPersona(assistantPersona: AssistantPersona | undefined) {
        this.setProp('assistantPersona', assistantPersona);
        this.executeDomAction('updateAssistantPersona', assistantPersona);
    }

    private resetConversationStarters() {
        const conversationStarters = this.getProp('conversationStarters') as ConversationStarter[] | undefined;
        this.setConversationStarters(conversationStarters);
    }
}
