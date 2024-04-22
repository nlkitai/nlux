import {BotPersona} from '../../../exports/aiChat/options/personaOptions';
import {CompUpdater} from '../../../types/comp';
import {CompConversationActions, CompConversationElements, CompConversationProps} from './conversation.types';

export const updateConversation: CompUpdater<
    CompConversationProps<unknown>, CompConversationElements, CompConversationActions
> = ({
    propName,
    newValue,
    dom: {actions},
}) => {
    if (propName === 'botPersona') {
        if (!actions) {
            return;
        }

        actions.updateBotPersona(newValue as BotPersona | undefined);

        return;
    }
};
