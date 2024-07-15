import {NluxUsageError} from '@shared/types/error';
import {CompRenderer, CompUpdater} from '../../types/comp';
import {BaseComp} from './base';

export const Model = <PropsType, ElementsType, EventsType, ActionsType>(
    compId: string,
    renderer: CompRenderer<PropsType, ElementsType, EventsType, ActionsType>,
    updater: CompUpdater<PropsType, ElementsType, ActionsType>,
) => {
    return (target: unknown) => {
        (target as {__compId: typeof compId}).__compId = compId;
        (target as {__renderer: typeof renderer}).__renderer = renderer;
        (target as {__updater: typeof updater}).__updater = updater;
    };
};

export const CompEventListener = <EventsType>(eventName: keyof EventsType) => (
    (target: unknown, methodName: string) => {
        const typedTarget = target as {
            constructor: typeof BaseComp;
        };
        if (typeof typedTarget.constructor !== 'function') {
            throw new NluxUsageError({
                source: 'CallbackFor',
                message: `@CallbackFor can only be used on methods of a class!`,
            });
        }

        if (
            !typedTarget.constructor.hasOwnProperty('__compEventListeners') ||
            typedTarget.constructor.__compEventListeners === null
        ) {
            typedTarget.constructor.__compEventListeners = new Map<string | number | symbol, string[]>();
        }

        const compEventListeners: Map<string | number | symbol, string[]> = typedTarget.constructor.__compEventListeners;
        const methodNames = compEventListeners.get(eventName);
        if (!methodNames) {
            compEventListeners.set(eventName, [methodName]);
        } else {
            methodNames.push(methodName);
        }
    }
);
