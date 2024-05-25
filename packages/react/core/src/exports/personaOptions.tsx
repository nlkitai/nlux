import {JSX} from 'react';

export interface AssistantPersona {
    name: string;
    picture: string | JSX.Element;
    tagline?: string;
}

export interface UserPersona {
    name: string;
    picture: string | JSX.Element;
}

export interface PersonaOptions {
    assistant?: AssistantPersona,
    user?: UserPersona,
}
