import {CompRegistry} from '../core/comp/registry';
import {CompChatRoom} from './chat/chat-room/model';
import {CompConversation} from './chat/conversation/model.ts';
import {CompChatbox} from './chat/prompt-box/model';
import {CompTextMessage} from './chat/text-message/model';
import {CompList} from './list/model';

export const registerAllComponents = () => {
    [
        CompList,
        CompChatRoom,
        CompChatbox,
        CompTextMessage,
        CompConversation,
    ].forEach(comp => CompRegistry.register(comp as any));
};
