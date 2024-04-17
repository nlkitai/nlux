import {NLError} from './error';
import {NLWarning} from './warning';

export type NLException = NLError | NLWarning;

export type NLExceptionType = NLError['type'] | NLWarning['type'];
