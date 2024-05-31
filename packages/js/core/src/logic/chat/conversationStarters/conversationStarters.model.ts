import {BaseComp} from '../../../exports/aiChat/comp/base';
import {Model} from '../../../exports/aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
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
    constructor(context: ControllerContext<AiMsg>, props: CompConversationStartersProps) {
        super(context, props);
    }
};
