import {v4} from "uuid";

export const SCHEMA_TYPE = 'schema';

export interface Schema {
    type: typeof SCHEMA_TYPE;
    id: string;
    name: string;
    external: boolean;
}

export interface SchemaParams {
    name: string;
    external?: boolean;
}

export function initSchema(params: SchemaParams): Schema {
    return {
        type: SCHEMA_TYPE,
        id: v4(),
        name: params.name,
        external: params.external || false,
    };
}