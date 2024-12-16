import type {Entities} from "./models/Entities.js";
import {initSchema, type Schema, type SchemaParams} from "./models/Schema.js";
import {initTable, type Table, type TableParams} from "./models/Table.js";

export class Supastate {
    constructor(private entities: Entities) {}

    addSchema(params: SchemaParams): Schema {
        const schema = initSchema(params);
        this.entities[schema.id] = schema;
        return schema;
    }

    addTable(params: TableParams): Table {
        const table = initTable(params);
        this.entities[table.id] = table;
        return table;
    }
}
