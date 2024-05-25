import {PersonaOptions} from '@nlux/core';
import {JSX} from 'react';
import {render} from 'react-dom';
import {PersonaOptions as ReactPersonasOptions} from '../exports/personaOptions';

const jsxToHtmlElement = (jsx: JSX.Element): Promise<HTMLElement> => {
    return new Promise((resolve) => {
        const div = document.createElement('div');
        render(jsx, div, () => {
            if (div.children.length !== 1 || !div.firstElementChild) {
                throw new Error('Expected exactly one child');
            }

            resolve(div.firstElementChild as HTMLElement);
        });
    });
};

export const reactPersonasToCorePersonas = async (reactPersonas: ReactPersonasOptions): Promise<PersonaOptions> => {
    const [assistant, user] = await Promise.all([
        (async () => {
            if (!reactPersonas.assistant) {
                return;
            }

            const assistantAvatar = typeof reactPersonas.assistant.avatar === 'string' ?
                reactPersonas.assistant.avatar :
                await jsxToHtmlElement(reactPersonas.assistant.avatar);

            return {
                name: reactPersonas.assistant.name,
                tagline: reactPersonas.assistant.tagline,
                avatar: assistantAvatar,
            };
        })(),
        (async () => {
            if (!reactPersonas.user) {
                return;
            }

            const userAvatar = typeof reactPersonas.user.avatar === 'string' ?
                reactPersonas.user.avatar :
                await jsxToHtmlElement(reactPersonas.user.avatar);

            return {
                name: reactPersonas.user.name,
                avatar: userAvatar,
            };
        })(),
    ]);

    return {
        assistant,
        user,
    };
};
