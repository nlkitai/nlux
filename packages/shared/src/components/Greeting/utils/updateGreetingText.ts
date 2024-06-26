export const greetingTextClassName = 'nlux-comp-welcomeMessage-text';

export const updateGreetingText = (
    root: HTMLElement,
    newGreeting: string | undefined,
) => {
    const greetingContainer = root.querySelector(`.${greetingTextClassName}`);
    if (newGreeting === '' || newGreeting === undefined) {
        greetingContainer?.remove();
        return;
    }

    if (greetingContainer) {
        greetingContainer.textContent = newGreeting;
    } else {
        const greetingTextContainer = document.createElement('div');
        greetingTextContainer.classList.add(greetingTextClassName);
        greetingTextContainer.textContent = newGreeting;
        root.appendChild(greetingTextContainer);
    }
};
