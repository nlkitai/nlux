import {readFileSync} from 'fs';

export const readJsonFile = (path: string): any => JSON.parse(readFileSync(path, 'utf8'));
