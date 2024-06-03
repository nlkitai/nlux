import {AnyAiMsg} from '@shared/types/anyAiMsg';
import {CompUpdater} from '../../../types/comp';
import {CompConversationActions, CompConversationElements, CompConversationProps} from './conversation.types';

export const updateConversation: CompUpdater<
    CompConversationProps<AnyAiMsg>, CompConversationElements, CompConversationActions
> = () => {
    // No update logic
};
