import {BaseComp} from '../../../aiChat/comp/base';
import {CompEventListener, Model} from '../../../aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {ConversationStarter} from '../../../types/conversationStarter';
import {renderConversationStarters} from './conversationStarters.renderer';
import {
    CompConversationStartersActions,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersProps,
} from './conversationStarters.types';
import {updateConversationStarters} from './conversationStarters.update';

@Model('conversationStarters', renderConversationStarters, updateConversationStarters)
export class CompConversationStarters<AiMsg> extends BaseComp<
    AiMsg,
    CompConversationStartersProps,
    CompConversationStartersElements,
    CompConversationStartersEvents,
    CompConversationStartersActions
> {
    public updateConversationStarters = (items: ConversationStarter[] | undefined): void => {
        // TODO
    };

    constructor(context: ControllerContext<AiMsg>, props: CompConversationStartersProps) {
        super(context, props);
    }

    @CompEventListener('conversation-starter-selected')
    conversationStarterClicked(conversationStarter: ConversationStarter) {
        const handler = this.getProp(
            'onConversationStarterSelected') as CompConversationStartersProps['onConversationStarterSelected'];
        handler(conversationStarter);
    };
}
