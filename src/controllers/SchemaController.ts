import {type Schema, SCHEMA_TYPE} from "../models/Schema.js";
import assert from "node:assert";
import type {EntityController} from "./EntityController.js";
import type {ISchemaController} from "./interfaces/ISchemaController.js";

export class SchemaController implements ISchemaController {
    readonly type = SCHEMA_TYPE;

    constructor(
        readonly schema: Schema,
    ) {}

    isExternal(): boolean {
        return this.schema.external;
    }

    alterDrop(target: EntityController): string {
        assert(target.type === SCHEMA_TYPE);
        // nothing in tables to alter
        return '';
    }

    alterCreate(target: EntityController): string {
        assert(target.type === SCHEMA_TYPE);
        // nothing in tables to alter
        return '';
    }

    create(): string {
        return `CREATE SCHEMA "${this.schema.name}";\n`;
    }

    drop(): string {
        return `DROP SCHEMA "${this.schema.name}";\n`;
    }

    getDependencies(): string[] {
        return [];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch.type === SCHEMA_TYPE) {
            return (
                this.schema.name === toMatch.schema.name
            );
        }
        return false;
    }
}
