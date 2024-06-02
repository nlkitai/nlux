export const welcomeMessageTextClassName = 'nlux-comp-welcomeMessage-text';

export const updateWelcomeMessageText = (
    root: HTMLElement,
    newWelcomeMessage: string | undefined,
) => {
    const welcomeMessageContainer = root.querySelector(`.${welcomeMessageTextClassName}`);
    if (newWelcomeMessage === '' || newWelcomeMessage === undefined) {
        welcomeMessageContainer?.remove();
        return;
    }

    if (welcomeMessageContainer) {
        welcomeMessageContainer.textContent = newWelcomeMessage;
    } else {
        const welcomeMessageTextContainer = document.createElement('div');
        welcomeMessageTextContainer.classList.add(welcomeMessageTextClassName);
        welcomeMessageTextContainer.textContent = newWelcomeMessage;
        root.appendChild(welcomeMessageTextContainer);
    }
};
