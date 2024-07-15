export interface AssistantPersona {
    avatar: string | Readonly<HTMLElement>;
    name: string;
    tagline?: string;
}

export interface UserPersona {
    avatar: string | Readonly<HTMLElement>;
    name: string;
}

export interface PersonaOptions {
    assistant?: AssistantPersona,
    user?: UserPersona,
}
