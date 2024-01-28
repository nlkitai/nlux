/**
 * A function that can be used to pre-process the output before sending it to the user.
 * The `output` parameter of this function will get the part of the response from the runnable
 * returned under the "output" property.
 *
 * This output is typically a JSON object containing the "content" property which
 * is often the actual response that the runnable wants to send to the user.
 * But it can also contain other properties, such as "metadata", or it can be a string.
 *
 * You check your runnable's documentation to see what it returns before you write this function.
 * This function should return a string that will be displayed to the user.
 */
export type LangServeOutputPreProcessor = (output: any) => string;
