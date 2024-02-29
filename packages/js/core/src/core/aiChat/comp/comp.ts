import {ControllerContext} from '../../../types/controllerContext';
import {CompRegistry} from './registry';

export const comp = <CompClass extends abstract new (...args: any) => any>(
    compClass: CompClass,
    // context: ControllerContext,
    // props: any | null = null,
    // compInstanceId: string | null = null,
) => {
    const compId = typeof compClass === 'function' ? (compClass as any).__compId : undefined;
    if (!compId) {
        throw new Error('Invalid compClass! Component should be registered before using');
    }

    const CompClass: any = CompRegistry.retrieve(compId)?.model;
    if (typeof CompClass !== 'function') {
        throw new Error(`Component "${compId}" is not registered`);
    }

    // IMPORTANT ✨ The lines below are responsible for creating all instances of all components.

    return {
        withContext: (newContext: ControllerContext) => {
            return {
                create: (): InstanceType<CompClass> => {
                    return new CompClass(newContext, {});
                },
                withProps: <PropsType = any>(newProps: PropsType) => {
                    return {
                        create: (): InstanceType<CompClass> => {
                            return new CompClass(newContext, newProps);
                        },
                    };
                },
            };
        },
    };
};
