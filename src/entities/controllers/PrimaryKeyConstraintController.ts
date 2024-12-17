import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import assert from "node:assert";
import {TableController} from "./TableController.js";
import {ColumnController} from "./ColumnController.js";
import {Entity} from "../models/Entity.js";
import {PRIMARY_KEY_CONSTRAINT_TYPE, PrimaryKeyConstraint} from "../models/PrimaryKeyConstraint.js";
import _ from "lodash";
const {map, join, differenceWith} = _;

export class PrimaryKeyConstraintController implements EntityController {
    private readonly primaryKeyConstraint: PrimaryKeyConstraint;
    private readonly tableController: TableController;
    private readonly columnControllers: ColumnController[];

    constructor(
        readonly entity: Entity,
        readonly entities: Entities,
    ) {
        assert(entity.entityType === PRIMARY_KEY_CONSTRAINT_TYPE);
        this.primaryKeyConstraint = entity;
        const table = entities[this.primaryKeyConstraint.tableId];
        this.tableController = new TableController(table, entities);
        this.columnControllers = map(
            this.primaryKeyConstraint.columnIds,
            columnId => new ColumnController(entities[columnId], entities)
        );
    }

    getSafeName(): string {
        return `"${this.primaryKeyConstraint.name}"`;
    }

    isExternal(): boolean {
        return this.primaryKeyConstraint.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof PrimaryKeyConstraintController);
        // nothing in primary key constraints to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof PrimaryKeyConstraintController);
        // nothing in primary key constraints to alter after creates
        return '';
    }

    create(): string {
        const primaryKeyColumns = map(this.columnControllers, columnController => columnController.getSafeName());
        return `ALTER TABLE ${this.tableController.getFullSafeName()} ADD CONSTRAINT ${this.getSafeName()} PRIMARY KEY (${join(primaryKeyColumns, ', ')});\n`;
    }

    drop(): string {
        return `ALTER TABLE ${this.tableController.getFullSafeName()} DROP CONSTRAINT ${this.getSafeName()};\n`;
    }

    getDependencies(): string[] {
        return [
            this.tableController.getId(),
            ...map(this.columnControllers, columnController => columnController.getId())
        ];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof PrimaryKeyConstraintController) {
            return (
                this.primaryKeyConstraint.name === toMatch.primaryKeyConstraint.name &&
                this.tableController.match(toMatch.tableController) &&
                // Check the difference both ways as the method only returns
                // elements from the first array
                differenceWith(
                    this.columnControllers,
                    toMatch.columnControllers,
                    (left, right) => left.match(right)
                ).length === 0 &&
                differenceWith(
                    toMatch.columnControllers,
                    this.columnControllers,
                    (left, right) => left.match(right)
                ).length === 0
            );
        }
        return false;
    }
}
