/**
 * A function that can be used to pre-process the input before sending it to the runnable.
 * Whatever this function returns will be sent to the runnable under the "input" property.
 *
 * Example:
 * If your runnable expects an object with a "message" property and a "year" property, you can
 * enrich the user input with the "year" property by using the following input pre-processor:
 *
 * For the following input processor:
 * ```
 * (message: string) => ({ message, year: 1999 })
 *  ```
 *  The following input will be sent to the runnable when the user
 *  types "Hello world":
 *  ```
 *  {
 *    input: {
 *      message: 'Hello world',
 *      year: 1999,
 *    }
 *  }
 *  ```
 */
export type LangServeInputPreProcessor = (
    input: string,
) => any;
