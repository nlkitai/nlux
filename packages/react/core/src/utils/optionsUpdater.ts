export const optionsUpdater = <OptionsType>(
    currentOptions: Partial<OptionsType> | undefined,
    newOptions: Partial<OptionsType> | undefined,
): Partial<OptionsType> | undefined => {
    if (currentOptions === undefined && newOptions === undefined) {
        //
        // Nothing to update.
        //
        return undefined;
    }

    if (currentOptions !== undefined && newOptions === undefined) {
        //
        // All previously set options (keys present in currentOptions) should explicitly be unset.
        //
        const result: Partial<OptionsType> = {};
        const keys = Object.keys(currentOptions) as Array<keyof OptionsType>;
        for (const key of keys) {
            result[key] = undefined;
        }

        return result;
    }

    if (currentOptions === undefined && newOptions !== undefined) {
        //
        // All new options (keys present in newOptions) should be set.
        //
        return newOptions;
    }

    // Just for TS checks - this should never happen.
    if (!newOptions || !currentOptions) {
        return undefined;
    }

    //
    // Only update the options that are different between the current and new options objects.
    //
    let somethingChanged = false;
    const newProps: Partial<OptionsType> = {};
    const keys = Object.keys(newOptions) as Array<keyof OptionsType>;
    for (const key of keys) {
        if (currentOptions[key] !== newOptions[key]) {
            newProps[key] = newOptions[key] as any;
            somethingChanged = true;
        }
    }

    return somethingChanged ? newProps : undefined;
};
