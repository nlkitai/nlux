const spaceToNbsp = (match: string) => {
    return new Array(match.length + 1).join('&nbsp;');
};

export const textToHtml = (message: string): string => {
    // Remove any existing HTML tags
    let result = message.replace(/<\/?[^>]+(>|$)/g, '');

    // Convert newlines to <br>
    result = result.replace(/\n/g, '<br />');

    // Convert multiple spaces to &nbsp;
    result = result.replace(/\s\s+/g, spaceToNbsp);

    return result;
};
