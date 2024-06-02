import {AvatarProps} from '../props';

export const updateNameOnAvatar = (
    element: HTMLElement,
    propsBefore: AvatarProps,
    propsAfter: AvatarProps,
): void => {
    if (propsBefore.name === propsAfter.name) {
        return;
    }

    if (typeof propsAfter.avatar === 'string') {
        const letter = propsAfter.name && propsAfter.name.length > 0 ?
            propsAfter.name[0].toUpperCase() : '';

        const letterContainer = element.querySelector(
            '* > .nlux-comp-avatarContainer > .avtr_ltr',
        );

        letterContainer?.replaceChildren(letter);
    }
};
