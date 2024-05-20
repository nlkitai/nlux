import {DomUpdater} from '../../types/dom/DomUpdater';
import {className as avatarClassName, createAvatarDom} from '../Avatar/create';
import {AvatarProps} from '../Avatar/props';
import {updateAvatarDom} from '../Avatar/update';
import {className as messageClassName} from '../Message/create';
import {updateMessageDom} from '../Message/update';
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
        propsBefore.picture === propsAfter.picture
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
        !propsAfter.hasOwnProperty('picture')
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
            }, {
                direction: propsAfter.direction,
                status: propsAfter.status,
                message: propsAfter.message,
            });
        }
    }

    if (
        propsBefore.name !== propsAfter.name ||
        propsBefore.picture !== propsAfter.picture
    ) {
        const personaDom = element.querySelector<HTMLElement>(`.${avatarClassName}`);
        if (!propsAfter.name && !propsAfter.picture) {
            personaDom?.remove();
            return;
        } else {
            if (personaDom) {
                updateAvatarDom(personaDom, {
                    name: propsBefore.name,
                    picture: propsBefore.picture,
                }, {
                    name: propsAfter.name,
                    picture: propsAfter.picture,
                });
            } else {
                // Add the avatar
                if (propsAfter.name !== undefined || propsAfter.picture !== undefined) {
                    const avatarProps: AvatarProps = {
                        name: propsAfter.name,
                        picture: propsAfter.picture,
                    };

                    const persona = createAvatarDom(avatarProps);
                    element.prepend(persona);
                }
            }
        }
    }
};
