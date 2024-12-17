import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import {type Table, TABLE_TYPE} from "../models/Table.js";
import {SCHEMA_TYPE} from "../models/Schema.js";
import assert from "node:assert";
import {SchemaController} from "./SchemaController.js";
import {Entity} from "../models/Entity.js";

export class TableController implements EntityController {
    private readonly table: Table;
    private readonly schemaController: SchemaController;

    constructor(
        readonly entity: Entity,
        readonly entities: Entities,
    ) {
        assert(entity.entityType === TABLE_TYPE);
        this.table = entity;
        const schema = entities[this.table.schemaId];
        this.schemaController = new SchemaController(schema);
    }

    getId(): string {
        return this.table.id;
    }

    getSafeName(): string {
        return `"${this.table.name}"`;
    }

    getFullSafeName(): string {
        return `${this.schemaController.getSafeName()}.${this.getSafeName()}`;
    }

    isExternal(): boolean {
        return this.table.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof TableController);
        // nothing in tables to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof TableController);
        // nothing in tables to alter after creates
        return '';
    }

    create(): string {
        return `CREATE TABLE ${this.getFullSafeName()} ();\n`;
    }

    drop(): string {
        return `DROP TABLE ${this.getFullSafeName()};\n`;
    }

    getDependencies(): string[] {
        return [this.schemaController.getId()];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof TableController) {
            return (
                this.table.name === toMatch.table.name &&
                this.schemaController.match(toMatch.schemaController)
            );
        }
        return false;
    }
}
