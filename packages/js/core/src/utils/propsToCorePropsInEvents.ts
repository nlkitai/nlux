import {AiChatProps, AiChatPropsInEvents} from '../types/aiChat/props';

export const propsToCorePropsInEvents = <AiMsg>(
    props: AiChatProps<AiMsg>,
): AiChatPropsInEvents<AiMsg> => {

    // All keys except the adapter key
    type KeyType = keyof AiChatPropsInEvents<AiMsg>;
    const excludeKeys: (keyof AiChatProps<AiMsg>)[] = [
        'adapter',
        'events',
    ];

    const keys: KeyType[] = Object.keys(props).filter(
        (key) => !excludeKeys.includes(key as keyof AiChatProps<AiMsg>),
    ) as KeyType[];

    const result = {} as Record<KeyType, AiChatPropsInEvents<AiMsg>[KeyType]>;
    for (let i = 0; i < keys.length; i++) {
        const key: KeyType = keys[i];
        result[key] = props[key];
    }

    return result as AiChatPropsInEvents<AiMsg>;
};
