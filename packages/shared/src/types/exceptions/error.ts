import {NLErrorId} from './errors';

export type NLError = {
    type: 'error';
    id: NLErrorId;
};
