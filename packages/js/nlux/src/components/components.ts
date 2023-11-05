import {CompRegistry} from '../core/comp/registry';
import {getGlobalNlux} from '../core/global';
import {CompChatRoom} from './chat/chat-room/model';
import {CompConversation} from './chat/conversation/model';
import {CompPromptBox} from './chat/prompt-box/model';
import {CompTextMessage} from './chat/text-message/model';
import {CompExceptionsBox} from './miscellaneous/exceptions-box/model';
import {CompList} from './miscellaneous/list/model';

const componentsById = () => ({
    'list': CompList,
    'chat-room': CompChatRoom,
    'exceptions-box': CompExceptionsBox,
    'conversation': CompConversation,
    'prompt-box': CompPromptBox,
    'text-message': CompTextMessage,
});

export const registerAllComponents = () => {
    const globalNlux = getGlobalNlux();
    const componentsRegistered = btoa('componentsRegistered');
    if (globalNlux && globalNlux[componentsRegistered] === true) {
        return;
    }

    Object.entries(componentsById()).forEach(([id, comp]) => {
        CompRegistry.register(comp as any);
    });

    if (typeof globalNlux === 'object') {
        globalNlux[componentsRegistered] = true;
    }
};
