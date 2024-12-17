import {type Schema, SCHEMA_TYPE} from "../models/Schema.js";
import assert from "node:assert";
import type {EntityController} from "./EntityController.js";
import {Entity} from "../models/Entity.js";

export class SchemaController implements EntityController {
    private readonly schema: Schema;

    constructor(
        readonly entity: Entity,
    ) {
        assert(entity.entityType === SCHEMA_TYPE);
        this.schema = entity;
    }

    getId(): string {
        return this.schema.id;
    }

    getSafeName(): string {
        return `"${this.schema.name}"`;
    }

    isExternal(): boolean {
        return this.schema.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof SchemaController);
        // nothing in schemas to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof SchemaController);
        // nothing in schemas to alter after creates
        return '';
    }

    create(): string {
        return `CREATE SCHEMA ${this.getSafeName()};\n`;
    }

    drop(): string {
        return `DROP SCHEMA ${this.getSafeName()};\n`;
    }

    getDependencies(): string[] {
        return [];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof SchemaController) {
            return (
                this.schema.name === toMatch.schema.name
            );
        }
        return false;
    }
}
