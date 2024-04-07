import {CompRegistry} from '../exports/aiChat/comp/registry';
import {getGlobalNlux} from '../exports/global';
import {CompChatRoom} from './chat/chat-room/chat-room.model';
import {CompConversation} from './chat/conversation/conversation.model';
import {CompMessage} from './chat/message/message.model';
import {CompPromptBox} from './chat/prompt-box/prompt-box.model';
import {CompExceptionsBox} from './miscellaneous/exceptions-box/model';
import {CompList} from './miscellaneous/list/model';

const componentsById = () => ({
    'list': CompList,
    'chat-room': CompChatRoom,
    'exceptions-box': CompExceptionsBox,
    'conversation': CompConversation,
    'prompt-box': CompPromptBox,
    'message': CompMessage,
});

export const registerAllComponents = () => {
    const globalNlux = getGlobalNlux();
    const componentsRegistered = btoa('componentsRegistered');
    if (globalNlux && globalNlux[componentsRegistered] === true) {
        return;
    }

    Object.entries(componentsById()).forEach(([, comp]) => {
        CompRegistry.register(comp as any);
    });

    if (typeof globalNlux === 'object') {
        globalNlux[componentsRegistered] = true;
    }
};
