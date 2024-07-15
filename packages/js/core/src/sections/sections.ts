import {BaseComp} from '../aiChat/comp/base';
import {CompRegistry} from '../aiChat/comp/registry';
import {getGlobalMetaData} from '../global';
import {CompChatItem} from './chat/chatItem/chatItem.model';
import {CompChatRoom} from './chat/chatRoom/chatRoom.model';
import {CompChatSegment} from './chat/chatSegment/chatSegment.model';
import {CompComposer} from './chat/composer/composer.model';
import {CompConversation} from './chat/conversation/conversation.model';
import {CompConversationStarters} from './chat/conversationStarters/conversationStarters.model';
import {CompLaunchPad} from './chat/launchPad/launchPad.model';
import {CompExceptionsBox} from './miscellaneous/exceptionsBox/model';

// Sections, in the Vanilla JavaScript version of NLUX, are a part of the library that combine user interface
// components, as well as the logic that drives them. They are not called `components` because the term `component` is
// reserved for ` pure `UI components that do not contain any business logic.

const sectionsById = () => ({
    // The main chat room component
    'chatRoom': CompChatRoom,

    // Kep top level components
    'launchPad': CompLaunchPad,
    'conversation': CompConversation,
    'composer': CompComposer,

    // Additional sub-components
    'conversationStarters': CompConversationStarters,
    'chatSegment': CompChatSegment,
    'chatItem': CompChatItem,

    // Miscellaneous
    'exceptionsBox': CompExceptionsBox,
});

export const registerAllSections = () => {
    const globalNlux = getGlobalMetaData();
    const sectionsRegistered = btoa('sectionsRegistered');
    if (globalNlux && globalNlux[sectionsRegistered] === true) {
        return;
    }

    Object.entries(sectionsById()).forEach(([, comp]) => {
        CompRegistry.register(comp as typeof BaseComp);
    });

    if (typeof globalNlux === 'object') {
        globalNlux[sectionsRegistered] = true;
    }
};
