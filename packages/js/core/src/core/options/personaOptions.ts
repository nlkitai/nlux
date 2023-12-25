export interface BotPersona {
    name: string;
    picture: string | Readonly<HTMLElement>;
    tagline?: string;
}

export interface UserPersona {
    name: string;
    picture: string | Readonly<HTMLElement>;
}

export interface PersonaOptions {
    bot?: BotPersona,
    user?: UserPersona,
}
