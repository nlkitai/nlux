import {ChatAdapter} from '../../../types/adapters/chat/chatAdapter';
import {ServerComponentChatAdapter} from '../../../types/adapters/chat/serverComponentChatAdapter';
import {StandardChatAdapter} from '../../../types/adapters/chat/standardChatAdapter';

export const getContentTypeToGenerate = <AiMsg>(
    adapter: ChatAdapter<AiMsg> | ServerComponentChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
): 'text' | 'server-component' => {
    if ('streamServerComponent' in adapter) {
        return 'server-component';
    }

    return 'text';
};
