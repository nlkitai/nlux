const rootNode = '.nluxc-root';

const chatRoomContainer = '> .nluxc-chat-room-container';

const exceptionsBoxContainer = '> .nluxc-exceptions-box-container';
const exceptionContainer = '> .nluxc-exceptions-box-exception-container';
const exceptionMessage = '> .nluxc-exceptions-box-message';

const promptBox = '> .nluxc-chat-room-prompt-box-container';
const promptBoxContainer = '> .nluxc-prompt-box-container';
const promptBoxTextInput = '> textarea.nluxc-prompt-box-text-input';
const promptBoxSendButton = '> button.nluxc-prompt-box-send-button';
const promptBoxLoadingSpinner = '> span.loader';

const conversationContainer = '> .nluxc-chat-room-conversation-container';
const conversationMessagesContainer = '> .nluxc-conversation-messages-container';

const q = (selectorParts: string[]) => () => {
    const selector = selectorParts.join(' ');
    return document.querySelector(selector);
};

export const selectors = Object.freeze({
    // High level selectors
    root: [rootNode],
    chatRoom: [rootNode, chatRoomContainer],

    // Exceptions box selectors
    exceptionsBox: [rootNode, exceptionsBoxContainer],
    exceptionContainer: [rootNode, exceptionsBoxContainer, exceptionContainer],
    exceptionMessage: [rootNode, exceptionsBoxContainer, exceptionContainer, exceptionMessage],

    // Prompt box selectors
    promptBox: [rootNode, chatRoomContainer, promptBox, promptBoxContainer],
    promptBoxContainer: [rootNode, chatRoomContainer, promptBox, promptBoxContainer],
    promptBoxTextInput: [rootNode, chatRoomContainer, promptBox, promptBoxContainer, promptBoxTextInput],
    promptBoxSendButton: [rootNode, chatRoomContainer, promptBox, promptBoxContainer, promptBoxSendButton],
    promptBoxLoadingSpinner: [rootNode, chatRoomContainer, promptBox, promptBoxContainer, promptBoxSendButton,
        promptBoxLoadingSpinner],

    // Conversation container selectors
    conversationContainer: [rootNode, chatRoomContainer, conversationContainer],
    conversationMessagesContainer: [rootNode, chatRoomContainer, conversationContainer, conversationMessagesContainer],
});

export const queries = Object.freeze({
    // High level queries
    root: q(selectors.root),
    chatRoom: q(selectors.chatRoom),

    // Exceptions box queries
    exceptionsBox: q(selectors.exceptionsBox),
    exceptionContainer: q(selectors.exceptionContainer),
    exceptionMessage: q(selectors.exceptionMessage),

    // Prompt box queries
    promptBox: q(selectors.promptBox),
    promptBoxContainer: q(selectors.promptBoxContainer),
    promptBoxTextInput: q(selectors.promptBoxTextInput),
    promptBoxSendButton: q(selectors.promptBoxSendButton),
    promptBoxLoadingSpinner: q(selectors.promptBoxLoadingSpinner),

    // Conversation container queries
    conversationContainer: q(selectors.conversationContainer),
    conversationMessagesContainer: q(selectors.conversationMessagesContainer),
});
