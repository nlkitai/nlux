export const welcomeMessageTextClassName = 'nlux_comp_wlc_msg_txt';

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
