import {CompRenderer, CompUpdater} from '../../../types/comp';
import {NluxUsageError} from '../../error';

export const Model = <PropsType, ElementsType, EventsType, ActionsType>(
    compId: string,
    renderer: CompRenderer<PropsType, ElementsType, EventsType, ActionsType>,
    updater: CompUpdater<PropsType, ElementsType, ActionsType>,
) => {
    return (target: any) => {
        target.__compId = compId;
        target.__renderer = renderer;
        target.__updater = updater;
    };
};

export const CompEventListener = <EventsType>(eventName: keyof EventsType) => (
    (target: any, methodName: string) => {
        if (typeof target.constructor !== 'function') {
            throw new NluxUsageError({
                source: 'CallbackFor',
                message: `@CallbackFor can only be used on methods of a class!`,
            });
        }

        if (
            !target.constructor.hasOwnProperty('__compEventListeners') ||
            target.constructor.__compEventListeners === null
        ) {
            target.constructor.__compEventListeners = new Map<string | number | symbol, string[]>();
        }

        const compEventListeners: Map<string | number | symbol, string[]> = target.constructor.__compEventListeners;
        const methodNames = compEventListeners.get(eventName);
        if (!methodNames) {
            compEventListeners.set(eventName, [methodName]);
        } else {
            methodNames.push(methodName);
        }
    }
);
