import {BaseComp} from '../../../aiChat/comp/base';
import {CompEventListener, Model} from '../../../aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {renderConversationStarters} from './conversationStarters.renderer';
import {
    CompConversationStartersActions,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersProps,
} from './conversationStarters.types';
import {updateConversationStarters} from './conversationStarters.update';
import {ConversationStarter} from '../../../types/conversationStarter';

@Model('conversationStarters', renderConversationStarters, updateConversationStarters)
export class CompConversationStarters<AiMsg> extends BaseComp<
    AiMsg,
    CompConversationStartersProps,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersActions
> {
    constructor(context: ControllerContext<AiMsg>, props: CompConversationStartersProps) {
        super(context, props);
    }

    public updateConversationStarters = (items: ConversationStarter[] | undefined): void => {
        // TODO
    };

    @CompEventListener('conversation-starter-selected')
    conversationStarterClicked(conversationStarter: ConversationStarter) {
        const handler = this.getProp('onConversationStarterSelected') as CompConversationStartersProps['onConversationStarterSelected'];
        handler(conversationStarter);
    };
}
