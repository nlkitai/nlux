import {AnyAiMsg} from '@shared/types/anyAiMsg';
import {AssistantPersona, UserPersona} from '../../../aiChat/options/personaOptions';
import {CompUpdater} from '../../../types/comp';
import {CompConversationActions, CompConversationElements, CompConversationProps} from './conversation.types';

export const updateConversation: CompUpdater<
    CompConversationProps<AnyAiMsg>, CompConversationElements, CompConversationActions
> = ({
         propName,
         newValue,
         dom: {actions},
     }) => {
    if (propName === 'assistantPersona') {
        if (!actions) {
            return;
        }

        actions.updateAssistantPersona(newValue as AssistantPersona | undefined);
        return;
    }

    if (propName === 'userPersona') {
        if (!actions) {
            return;
        }

        actions.updateUserPersona(newValue as UserPersona | undefined);
        return;
    }
};
