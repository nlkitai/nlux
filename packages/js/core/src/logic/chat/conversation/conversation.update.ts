import {BotPersona} from '../../../core/aiChat/options/personaOptions';
import {CompUpdater} from '../../../types/comp';
import {CompConversationActions, CompConversationElements, CompConversationProps} from './conversation.types';

export const updateConversation: CompUpdater<
    CompConversationProps, CompConversationElements, CompConversationActions
> = ({
    propName,
    newValue,
    dom: {elements, actions},
}) => {
    if (propName === 'botPersona') {
        if (!actions) {
            return;
        }

        actions.updateBotPersona(newValue as BotPersona | undefined);

        return;
    }
};
