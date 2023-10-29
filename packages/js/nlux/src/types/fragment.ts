import {Participant} from './participant';

export type FragmentType = 'text' | 'audio' | 'html' | 'image' | 'video' | 'file';

export type Fragment = {
    id: string;
    type: FragmentType;
    content: any; // TODO - TBD
    creator: Participant;
    createdAt: Date;
}
