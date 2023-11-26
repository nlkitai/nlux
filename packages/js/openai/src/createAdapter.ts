import {OpenAiAdapterBuilder} from './openai/gpt/builders/builder';
import {OpenAiAdapterBuilderImpl} from './openai/gpt/builders/builderImpl';

export const createAdapter = (): OpenAiAdapterBuilder => new OpenAiAdapterBuilderImpl();
