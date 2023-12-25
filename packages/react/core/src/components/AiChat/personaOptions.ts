import {JSX} from 'react';

export interface BotPersona {
    name: string;
    picture: string | JSX.Element;
    tagline?: string;
}

export interface UserPersona {
    name: string;
    picture: string | JSX.Element;
}

export interface PersonaOptions {
    bot?: BotPersona,
    user?: UserPersona,
}
