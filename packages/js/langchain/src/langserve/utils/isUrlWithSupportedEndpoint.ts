export const isUrlWithSupportedEndpoint = (url: string) => {
    const regEx = /\/.*\/(invoke|stream)$/g;
    return regEx.test(url);
};
