import {ChatItem} from '@nlux/core';
import {warn} from '@shared/utils/warn';

export const transformInputBasedOnSchema = <AiMsg>(
    message: string,
    conversationHistory: ChatItem<AiMsg>[] | undefined,
    schema: unknown,
    runnableName: string,
): unknown | undefined => {
    // TODO - Attempt to include conversation history in the input
    //   if the schema allows it.

    const typedSchema = schema as Record<string, unknown> | undefined;
    if (!typedSchema || typeof typedSchema.properties !== 'object') {
        return message;
    }

    if (typeof typedSchema !== 'object' || !typedSchema) {
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

    if (typedSchema.type === 'string') {
        return message;
    }

    if (typedSchema.type === 'object') {
        const properties: Record<string, unknown> = (
            typeof typedSchema.properties === 'object' && typedSchema.properties
        )
            ? typedSchema.properties as Record<string, unknown>
            : {};

        const schemaStringProps = Object
            .keys(properties)
            .filter((key) => key && typeof (properties[key] as Record<string, unknown>).type === 'string')
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
