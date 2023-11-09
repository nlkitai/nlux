import {Tag} from './tag';
import {code} from './tags/code';
import {h1} from './tags/h1';
import {h2} from './tags/h2';
import {h3} from './tags/h3';
import {p} from './tags/p';
import {pre} from './tags/pre';

export const TagsByName: {[key: string]: Tag} = {
    p,
    h1,
    h2,
    h3,
    code,
    pre,
};
