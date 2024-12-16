import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import {type Table, TABLE_TYPE} from "../models/Table.js";
import {SCHEMA_TYPE} from "../models/Schema.js";
import assert from "node:assert";
import {SchemaController} from "./SchemaController.js";
import type {ITableController} from "./interfaces/ITableController.js";

export class TableController implements ITableController {
    readonly type = TABLE_TYPE;
    readonly schemaController: SchemaController;

    constructor(
        readonly table: Table,
        readonly entities: Entities,
    ) {
        const schema = entities[table.schemaId];
        assert(schema.type === SCHEMA_TYPE);
        this.schemaController = new SchemaController(schema);
    }

    isExternal(): boolean {
        return this.table.external;
    }

    alterDrop(target: EntityController): string {
        assert(target.type === TABLE_TYPE);
        // nothing in tables to alter
        return '';
    }

    alterCreate(target: EntityController): string {
        assert(target.type === TABLE_TYPE);
        // nothing in tables to alter
        return '';
    }

    create(): string {
        return `CREATE TABLE "${this.schemaController.schema.name}"."${this.table.name}";\n`;
    }

    drop(): string {
        return `DROP TABLE "${this.schemaController.schema.name}"."${this.table.name}";\n`;
    }

    getDependencies(): string[] {
        return [this.schemaController.schema.id];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch.type === TABLE_TYPE) {
            return (
                this.table.name === toMatch.table.name &&
                this.schemaController.match(toMatch.schemaController)
            );
        }
        return false;
    }
}
