import {ChatItem, warn} from '@nlux/core';

export const transformInputBasedOnSchema = (
    message: string,
    conversationHistory: readonly ChatItem[] | undefined,
    schema: any,
    runnableName: string,
): any | undefined => {
    // TODO - Attempt to include conversation history in the input
    //   if the schema allows it.

    if (!schema || typeof schema.properties !== 'object') {
        return message;
    }

    if (typeof schema !== 'object' || !schema) {
        warn(
            `LangServer adapter cannot process the input schema fetched for runnable "${runnableName}". ` +
            'The user message will be sent to LangServe endpoint as is without transformations. ' +
            `To override this behavior, you can either set the "useInputSchema" option to false, ` +
            `or provide a custom input pre-processor via the "inputPreProcessor" option, ` +
            `or update your endpoint and input schema to have an object with a single ` +
            `string property or a string as input.`,
        );

        return message;
    }

    if (schema.type === 'string') {
        return message;
    }

    if (schema.type === 'object') {
        const properties = (typeof schema.properties === 'object' && schema.properties) ? schema.properties : {};
        const schemaStringProps = Object
            .keys(properties)
            .filter((key) => key && typeof schema.properties[key].type === 'string')
            .map((key) => key);

        if (schemaStringProps.length !== 1) {
            warn(
                `LangServer adapter cannot find a valid property to match to user input inside ` +
                'the "${runnableName}" input schema. The user message will be sent to LangServe endpoint as ' +
                `is without transformations. To override this behavior, you can either set the "useInputSchema" ` +
                `option to false, or provide a custom input pre-processor via the "inputPreProcessor" option, ` +
                `or update your endpoint and input schema to have an object with a single ` +
                `string property or a string accepted as part of input schema.`,
            );
        } else {
            const propToUse = schemaStringProps[0];
            return ({
                [propToUse]: message,
            });
        }
    }

    return undefined;
};
