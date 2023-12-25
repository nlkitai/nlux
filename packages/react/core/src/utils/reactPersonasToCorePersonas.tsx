import {PersonaOptions} from '@nlux/core';
import {JSX} from 'react';
import {render} from 'react-dom';
import {PersonaOptions as ReactPersonasOptions} from '../components/AiChat/personaOptions';

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
    const [bot, user] = await Promise.all([
        (async () => {
            if (!reactPersonas.bot) {
                return;
            }

            const botPicture = typeof reactPersonas.bot.picture === 'string' ?
                reactPersonas.bot.picture :
                await jsxToHtmlElement(reactPersonas.bot.picture);

            return {
                name: reactPersonas.bot.name,
                tagline: reactPersonas.bot.tagline,
                picture: botPicture,
            };
        })(),
        (async () => {
            if (!reactPersonas.user) {
                return;
            }

            const userPicture = typeof reactPersonas.user.picture === 'string' ?
                reactPersonas.user.picture :
                await jsxToHtmlElement(reactPersonas.user.picture);

            return {
                name: reactPersonas.user.name,
                picture: userPicture,
            };
        })(),
    ]);

    return {
        bot,
        user,
    };
};
