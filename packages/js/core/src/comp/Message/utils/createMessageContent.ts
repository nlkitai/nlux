export const createMessageContent = (message: string): HTMLElement | Text => {
    // Render message as a text node to avoid XSS
    // TODO - Handle markdown rendering
    return document.createTextNode(message);
};
