import {DomUpdater} from '../../types/dom/DomUpdater';
import {className as avatarClassName} from '../Avatar/create';
import {updateAvatarDom} from '../Avatar/update';
import {className as messageClassName} from '../Message/create';
import {updateMessageDom} from '../Message/update';
import {ChatItemProps} from './props';
import {applyNewDirectionClassName} from './utils/applyNewDirectionClassName';

export const updateChatItemDom: DomUpdater<ChatItemProps> = (
    element,
    propsBefore,
    propsAfter,
) => {
    if (
        propsBefore.direction === propsAfter.direction &&
        propsBefore.status === propsAfter.status &&
        propsBefore.message === propsAfter.message &&
        propsBefore.loader === propsAfter.loader &&
        propsBefore.name === propsAfter.name &&
        propsBefore.picture === propsAfter.picture
    ) {
        return;
    }

    if (!propsAfter || (
        !propsAfter.hasOwnProperty('direction') &&
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

    if (
        propsBefore.direction !== propsAfter.direction ||
        propsBefore.status !== propsAfter.status ||
        propsBefore.message !== propsAfter.message ||
        propsBefore.loader !== propsAfter.loader
    ) {
        const messageDom = element.querySelector<HTMLElement>(`.${messageClassName}`);
        if (messageDom) {
            updateMessageDom(messageDom, {
                direction: propsBefore.direction,
                status: propsBefore.status,
                message: propsBefore.message,
                loader: propsBefore.loader,
            }, {
                direction: propsAfter.direction,
                status: propsAfter.status,
                message: propsAfter.message,
                loader: propsAfter.loader,
            });
        }
    }

    if (
        propsBefore.name !== propsAfter.name ||
        propsBefore.picture !== propsAfter.picture
    ) {
        const personaDom = element.querySelector<HTMLElement>(`.${avatarClassName}`);
        if (personaDom) {
            updateAvatarDom(personaDom, {
                name: propsBefore.name,
                picture: propsBefore.picture,
            }, {
                name: propsAfter.name,
                picture: propsAfter.picture,
            });
        }
    }

    // TODO - Handle prop changes
};
