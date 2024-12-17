import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import assert from "node:assert";
import {TableController} from "./TableController.js";
import {RLS_ENABLED_TYPE, RLSEnabled} from "../models/RLSEnabled.js";
import {TABLE_TYPE} from "../models/Table.js";
import {Column, COLUMN_TYPE} from "../models/Column.js";
import {Entity} from "../models/Entity.js";

export class ColumnController implements EntityController {
    private readonly column: Column;
    private readonly tableController: TableController;

    constructor(
        readonly entity: Entity,
        readonly entities: Entities,
    ) {
        assert(entity.entityType === COLUMN_TYPE);
        this.column = entity;
        const table = entities[this.column.tableId];
        this.tableController = new TableController(table, entities);
    }

    getId(): string {
        return this.column.id;
    }

    getSafeName(): string {
        return `"${this.column.name}"`;
    }

    getFullSafeName(): string {
        return `${this.tableController.getFullSafeName()}.${this.getSafeName()}`;
    }

    getTableFullSafeName(): string {
        return this.tableController.getFullSafeName();
    }

    isExternal(): boolean {
        return this.column.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof ColumnController);
        // nothing in columns to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof ColumnController);
        // nothing in columns to alter after creates
        return '';
    }

    create(): string {
        return `ALTER TABLE ${this.tableController.getFullSafeName()} ADD ${this.getSafeName()} ${this.column.type};\n`;
    }

    drop(): string {
        return `ALTER TABLE ${this.tableController.getFullSafeName()} DROP ${this.getSafeName()};\n`;
    }

    getDependencies(): string[] {
        return [this.tableController.getId()];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof ColumnController) {
            return (
                this.tableController.match(toMatch.tableController) &&
                this.column.name === toMatch.column.name &&
                // TODO: type changes could be supported as alters but
                // TODO: additional functionality will be needed to drop
                // TODO: constraints like foreign keys before and add them
                // TODO: back after
                this.column.type === toMatch.column.type
            );
        }
        return false;
    }
}
