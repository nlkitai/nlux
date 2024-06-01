import {debug} from '@shared/utils/debug';
import {warn} from '@shared/utils/warn';
import {CompDef, CompRenderer, CompUpdater} from '../../types/comp';
import {BaseComp} from './base';

export class CompRegistry {
    public static componentDefs: Map<string, CompDef<unknown, unknown, unknown, unknown>> = new Map();

    public static register(compClass: typeof BaseComp) {
        const compId = compClass.__compId;
        if (!compId) {
            warn('Component definition missing valid id');
            return;
        }

        if (CompRegistry.componentDefs.get(compId) !== undefined) {
            debug(`Component with id "${compId}" already registered`);
            return;
        }

        if (!compClass.__renderer || !compClass.__updater) {
            warn(`Component with id "${compId}" missing renderer or updater`);
            return;
        }

        CompRegistry.componentDefs.set(compId, {
            id: compId,
            model: compClass,
            render: compClass.__renderer as CompRenderer<unknown, unknown, unknown, unknown>,
            update: compClass.__updater as CompUpdater<unknown, unknown, unknown>,
        });
    }

    public static retrieve<
        PropsType = unknown, ElementsType = unknown, EventsType = unknown, ActionsType = unknown
    >(id: string): CompDef<PropsType, ElementsType, EventsType, ActionsType> | undefined {
        const def = CompRegistry.componentDefs.get(id);
        if (!def) {
            warn(`Component with id "${id}" not registered`);
            return undefined;
        }

        return def as CompDef<PropsType, ElementsType, EventsType, ActionsType>;
    }
}
