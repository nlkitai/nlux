export const isPrimitiveReactNodeType = (value: unknown) => {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null
        || value === undefined;
};
