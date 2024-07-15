import {KeyboardEvent} from 'react';

export const isSubmitShortcutKey = (
    event: KeyboardEvent,
    submitShortcut?: 'Enter' | 'CommandEnter',
): boolean => {
    if (!submitShortcut || submitShortcut === 'Enter') {
        const isEnter = event.key === 'Enter' && !event.nativeEvent.isComposing;
        const aModifierKeyIsPressed = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
        return isEnter && !aModifierKeyIsPressed;
    }

    if (submitShortcut === 'CommandEnter') {
        const isCommandEnter = event.key === 'Enter' && (
            event.getModifierState('Control') || event.getModifierState('Meta')
        );

        if (isCommandEnter) {
            return true;
        }
    }

    return false;
};
