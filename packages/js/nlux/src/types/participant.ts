export type Participant = {
    id: string;
    role: 'user' | 'system' | 'bot';
    displayName: string;
}
