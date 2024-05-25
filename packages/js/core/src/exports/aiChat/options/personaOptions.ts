export interface AssistantPersona {
    name: string;
    avatar: string | Readonly<HTMLElement>;
    tagline?: string;
}

export interface UserPersona {
    name: string;
    avatar: string | Readonly<HTMLElement>;
}

export interface PersonaOptions {
    assistant?: AssistantPersona,
    user?: UserPersona,
}
