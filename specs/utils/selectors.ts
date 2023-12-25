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

const sentMessageContainer = '.nluxc-text-message-container.nluxc-text-message-sent';
const receivedMessageContainer = '.nluxc-text-message-container.nluxc-text-message-received';
const messageLoader = '.nluxc-text-message-loader';

const messagePersona = '.nluxc-text-message-persona';
const messagePersonaPhotoContainer = '.nluxc-text-message-persona-photo-container';
const messagePersonaPhotoLetter = '.nluxc-text-message-persona-letter';
const messagePersonaRenderedPhoto = '.nluxc-text-message-persona-rendered-photo';

const welcomeMessageContainer = '.nluxc-conversation-welcome-message-name-and-tagline';
const welcomeMessageBotName = '.nluxc-conversation-welcome-message-name';
const welcomeMessageBotTagline = '.nluxc-conversation-welcome-message-tagline';

export const q = (selectorParts: string[]) => () => {
    const selector = selectorParts.join(' ');
    return document.querySelector(selector);
};

export const qAll = (selectorParts: string[]) => () => {
    const selector = selectorParts.join(' ');
    return document.querySelectorAll(selector);
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
    promptBoxLoadingSpinner: [
        rootNode, chatRoomContainer, promptBox, promptBoxContainer, promptBoxSendButton,
        promptBoxLoadingSpinner,
    ],

    // Conversation container selectors
    conversationContainer: [rootNode, chatRoomContainer, conversationContainer],
    conversationMessagesContainer: [rootNode, chatRoomContainer, conversationContainer, conversationMessagesContainer],
    conversationMessagesLoadingSpinner: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        messageLoader,
    ],

    // Message selectors
    sentMessageContainer: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        sentMessageContainer,
    ],
    receivedMessageContainer: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        receivedMessageContainer,
    ],

    // Personas pictures
    sentMessagePersonaContainer: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        sentMessageContainer,
        messagePersona,
    ],
    sentMessagePersonaRenderedPhoto: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        sentMessageContainer,
        messagePersona,
        messagePersonaPhotoContainer,
        messagePersonaRenderedPhoto,
    ],
    sentMessagePersonaPhotoLetter: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        sentMessageContainer,
        messagePersona,
        messagePersonaPhotoContainer,
        messagePersonaPhotoLetter,
    ],
    receivedMessagePersonaContainer: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        receivedMessageContainer,
        messagePersona,
    ],
    receivedMessagePersonaRenderedPhoto: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        receivedMessageContainer,
        messagePersona,
        messagePersonaPhotoContainer,
        messagePersonaRenderedPhoto,
    ],
    receivedMessagePersonaPhotoLetter: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        receivedMessageContainer,
        messagePersona,
        messagePersonaPhotoContainer,
        messagePersonaPhotoLetter,
    ],
    welcomeMessage: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        welcomeMessageContainer,
    ],
    welcomeMessageBotName: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        welcomeMessageContainer,
        welcomeMessageBotName,
    ],
    welcomeMessageBotTagline: [
        rootNode,
        chatRoomContainer,
        conversationContainer,
        conversationMessagesContainer,
        welcomeMessageContainer,
        welcomeMessageBotTagline,
    ],
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

    // Message queries
    sentMessageContainer: q(selectors.sentMessageContainer),
    receivedMessageContainer: q(selectors.receivedMessageContainer),
    conversationMessagesLoadingSpinner: q(selectors.conversationMessagesLoadingSpinner),

    // Personas profile picture
    sentMessagePersonaContainer: q(selectors.sentMessagePersonaContainer),
    sentMessagePersonaRenderedPhoto: q(selectors.sentMessagePersonaRenderedPhoto),
    sentMessagePersonaPhotoLetter: q(selectors.sentMessagePersonaPhotoLetter),
    receivedMessagePersonaContainer: q(selectors.receivedMessagePersonaContainer),
    receivedMessagePersonaRenderedPhoto: q(selectors.receivedMessagePersonaRenderedPhoto),
    receivedMessagePersonaPhotoLetter: q(selectors.receivedMessagePersonaPhotoLetter),

    // Welcome message
    welcomeMessage: q(selectors.welcomeMessage),
    welcomeMessageBotName: q(selectors.welcomeMessageBotName),
    welcomeMessageBotTagline: q(selectors.welcomeMessageBotTagline),
});
