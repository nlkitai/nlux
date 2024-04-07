// Types that can be rendered in React
export const isPrimitiveReactNodeType = (value: any) => {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null
        || value === undefined;
};
