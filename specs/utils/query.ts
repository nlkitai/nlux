const rootNodeSelector = '.nluxc-root';

export const queryBuilder = (base: string = '') => {
    const selectorPrefix = `${rootNodeSelector}${base ? ` ${base}` : ''}`;
    return {
        query: (selector: string = '') => document
            .querySelector(`${selectorPrefix}${selector ? ` ${selector}` : ''}`),

        queryAll: (selector: string = '') => document
            .querySelectorAll(`${selectorPrefix}${selector ? ` ${selector}` : ''}`),
    };
};
