import {BaseComp} from '../exports/aiChat/comp/base';
import {CompRegistry} from '../exports/aiChat/comp/registry';
import {getGlobalNlux} from '../exports/global';
import {CompChatItem} from './chat/chatItem/chatItem.model';
import {CompChatRoom} from './chat/chatRoom/chatRoom.model';
import {CompChatSegment} from './chat/chatSegment/chatSegment.model';
import {CompConversation} from './chat/conversation/conversation.model';
import {CompConversationStarters} from './chat/conversationStarters/conversationStarters.model';
import {CompComposer} from './chat/composer/composer.model';
import {CompExceptionsBox} from './miscellaneous/exceptionsBox/model';

// Sections, in the Vanilla JavaScript version of NLUX, are a part of the library that combine user interface components,
// as well as the logic that drives them. They are not called `components` because the term `component` is reserved for
//` pure `UI components that do not contain any business logic.

const sectionsById = () => ({
    'chatRoom': CompChatRoom,
    'exceptionsBox': CompExceptionsBox,
    'conversation': CompConversation,
    'conversationStarters': CompConversationStarters,
    'composer': CompComposer,
    'chatSegment': CompChatSegment,
    'chatItem': CompChatItem,
});

export const registerAllSections = () => {
    const globalNlux = getGlobalNlux();
    const componentsRegistered = btoa('componentsRegistered');
    if (globalNlux && globalNlux[componentsRegistered] === true) {
        return;
    }

    Object.entries(sectionsById()).forEach(([, comp]) => {
        CompRegistry.register(comp as typeof BaseComp);
    });

    if (typeof globalNlux === 'object') {
        globalNlux[componentsRegistered] = true;
    }
};
