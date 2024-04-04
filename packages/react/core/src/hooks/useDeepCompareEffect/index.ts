//
// The following code was extracted from the `use-deep-compare-effect` package
// * GitHub: https://github.com/kentcdodds/use-deep-compare-effect
// * npm: https://www.npmjs.com/package/use-deep-compare-effect
// * License: MIT
//

import {useEffect, useMemo, useRef} from 'react';
import {dequal as deepEqual} from '../dequal';

type UseEffectParams = Parameters<typeof useEffect>
type EffectCallback = UseEffectParams[0]
type DependencyList = UseEffectParams[1]
// yes, I know it's void, but I like what this communicates about
// the intent of these functions: It's just like useEffect
type UseEffectReturn = ReturnType<typeof useEffect>

function checkDeps(deps: DependencyList) {
    if (!deps || !deps.length) {
        throw new Error(
            'useDeepCompareEffect should not be used with no dependencies. Use React.useEffect instead.',
        );
    }
    if (deps.every(isPrimitive)) {
        throw new Error(
            'useDeepCompareEffect should not be used with dependencies that are all primitive values. Use React.useEffect instead.',
        );
    }
}

function isPrimitive(val: unknown) {
    return val == null || /^[sbn]/.test(typeof val);
}

/**
 * @param value the value to be memoized (usually a dependency list)
 * @returns a memoized version of the value as long as it remains deeply equal
 */
export function useDeepCompareMemoize<T>(value: T) {
    const ref = useRef<T>(value);
    const signalRef = useRef<number>(0);

    if (!deepEqual(value, ref.current)) {
        ref.current = value;
        signalRef.current += 1;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => ref.current, [signalRef.current]);
}

function useDeepCompareEffect(
    callback: EffectCallback,
    dependencies: DependencyList,
): UseEffectReturn {
    if (process.env.NODE_ENV !== 'production') {
        checkDeps(dependencies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useEffect(callback, useDeepCompareMemoize(dependencies));
}

export function useDeepCompareEffectNoCheck(
    callback: EffectCallback,
    dependencies: DependencyList,
): UseEffectReturn {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useEffect(callback, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareEffect;
