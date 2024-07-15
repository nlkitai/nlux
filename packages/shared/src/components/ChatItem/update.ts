import {DomUpdater} from '../../types/dom/DomUpdater';
import {className as avatarClassName, createAvatarDom} from '../Avatar/create';
import {AvatarProps} from '../Avatar/props';
import {updateAvatarDom} from '../Avatar/update';
import {className as messageClassName} from '../Message/create';
import {updateMessageDom} from '../Message/update';
import {participantInfoContainerClassName, participantNameClassName} from './create';
import {ChatItemProps} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';
import {applyNewLayoutClassName} from './utils/applyNewLayoutClassName';

export const updateChatItemDom: DomUpdater<ChatItemProps> = (
    element,
    propsBefore,
    propsAfter,
) => {
    if (
        propsBefore.direction === propsAfter.direction &&
        propsBefore.layout === propsAfter.layout &&
        propsBefore.status === propsAfter.status &&
        propsBefore.message === propsAfter.message &&
        propsBefore.name === propsAfter.name &&
        propsBefore.avatar === propsAfter.avatar
    ) {
        return;
    }

    if (!propsAfter || (
        !propsAfter.hasOwnProperty('direction') &&
        !propsAfter.hasOwnProperty('layout') &&
        !propsAfter.hasOwnProperty('status') &&
        !propsAfter.hasOwnProperty('message') &&
        !propsAfter.hasOwnProperty('loader') &&
        !propsAfter.hasOwnProperty('name') &&
        !propsAfter.hasOwnProperty('avatar')
    )) {
        return;
    }

    if (propsBefore.direction !== propsAfter.direction) {
        applyNewDirectionClassName(element, propsAfter.direction);
    }

    if (propsBefore.layout !== propsAfter.layout) {
        applyNewLayoutClassName(element, propsAfter.layout);
    }

    if (
        propsBefore.direction !== propsAfter.direction ||
        propsBefore.status !== propsAfter.status ||
        propsBefore.message !== propsAfter.message
    ) {
        const messageDom = element.querySelector<HTMLElement>(`.${messageClassName}`);
        if (messageDom) {
            updateMessageDom(messageDom, {
                direction: propsBefore.direction,
                status: propsBefore.status,
                message: propsBefore.message,
                htmlSanitizer: propsBefore.htmlSanitizer,
            }, {
                direction: propsAfter.direction,
                status: propsAfter.status,
                message: propsAfter.message,
                htmlSanitizer: propsBefore.htmlSanitizer,
            });
        }
    }

    if (
        propsBefore.name !== propsAfter.name ||
        propsBefore.avatar !== propsAfter.avatar
    ) {
        const avatarDom = element.querySelector<HTMLElement>(`.${avatarClassName}`);
        if (!propsAfter.name && !propsAfter.avatar) {
            avatarDom?.remove();
            return;
        } else {
            if (avatarDom) {
                updateAvatarDom(avatarDom, {
                    name: propsBefore.name,
                    avatar: propsBefore.avatar,
                }, {
                    name: propsAfter.name,
                    avatar: propsAfter.avatar,
                });
            } else {
                // Add the avatar
                if (propsAfter.name !== undefined || propsAfter.avatar !== undefined) {
                    const avatarProps: AvatarProps = {
                        name: propsAfter.name,
                        avatar: propsAfter.avatar,
                    };

                    const persona = createAvatarDom(avatarProps);
                    const participantInfoDom = element.querySelector<HTMLElement>(
                        `.${participantInfoContainerClassName}`);
                    if (participantInfoDom) {
                        participantInfoDom.prepend(persona);
                    }
                }
            }
        }
    }

    if (propsBefore.name !== propsAfter.name) {
        const participantNameContainer = element.querySelector<HTMLElement>(`.${participantNameClassName}`);
        if (participantNameContainer) {
            participantNameContainer.textContent = propsAfter.name || '';
        }
    }
};
