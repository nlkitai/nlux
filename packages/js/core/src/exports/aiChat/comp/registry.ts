import {CompDef} from '../../../types/comp';
import {debug} from '../../../utils/debug';
import {warn} from '../../../utils/warn';
import {BaseComp} from './base';

export class CompRegistry {
    public static componentDefs: Map<string, CompDef<any, any, any, any>> = new Map();

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
            render: compClass.__renderer as any,
            update: compClass.__updater as any,
        });
    }

    public static retrieve(id: string): CompDef<any, any, any, any> | undefined {
        const def = CompRegistry.componentDefs.get(id);
        if (!def) {
            warn(`Component with id "${id}" not registered`);
            return undefined;
        }

        return def;
    }
}
