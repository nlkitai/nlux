import {StandardAdapter} from './standardAdapter';

export interface AdapterBuilder {
    create(): StandardAdapter;
}
