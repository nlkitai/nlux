import {CompRenderer} from '../../../types/comp';
import {CompListElements, CompListEvents, CompListProps} from './types';

export const renderList: CompRenderer<CompListProps, CompListElements, CompListEvents> = () => {
    return {
        elements: {},
    };
};
