export interface AssistantPersona {
    name: string;
    picture: string | Readonly<HTMLElement>;
    tagline?: string;
}

export interface UserPersona {
    name: string;
    picture: string | Readonly<HTMLElement>;
}

export interface PersonaOptions {
    assistant?: AssistantPersona,
    user?: UserPersona,
}
