import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import assert from "node:assert";
import {TableController} from "./TableController.js";
import {ColumnController} from "./ColumnController.js";
import {Entity} from "../models/Entity.js";
import _ from "lodash";
import {FOREIGN_KEY_CONSTRAINT_TYPE, ForeignKeyConstraint} from "../models/ForeignKeyConstraint.js";
const {map, join, differenceWith} = _;

export class ForeignKeyConstraintController implements EntityController {
    private readonly foreignKeyConstraint: ForeignKeyConstraint;
    private readonly tableController: TableController;
    private readonly columnControllers: ColumnController[];
    private readonly otherTableController: TableController;
    private readonly otherColumnControllers: ColumnController[];

    constructor(
        readonly entity: Entity,
        readonly entities: Entities,
    ) {
        assert(entity.entityType === FOREIGN_KEY_CONSTRAINT_TYPE);
        this.foreignKeyConstraint = entity;
        const table = entities[this.foreignKeyConstraint.tableId];
        this.tableController = new TableController(table, entities);
        this.columnControllers = map(
            this.foreignKeyConstraint.columnIds,
            columnId => new ColumnController(entities[columnId], entities)
        );
        const otherTable = entities[this.foreignKeyConstraint.otherTableId];
        this.otherTableController = new TableController(otherTable, entities);
        this.otherColumnControllers = map(
            this.foreignKeyConstraint.otherColumnIds,
            columnId => new ColumnController(entities[columnId], entities)
        );
    }

    getSafeName(): string {
        return `"${this.foreignKeyConstraint.name}"`;
    }

    isExternal(): boolean {
        return this.foreignKeyConstraint.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof ForeignKeyConstraintController);
        // nothing in foreign key constraints to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof ForeignKeyConstraintController);
        // nothing in foreign key constraints to alter after creates
        return '';
    }

    create(): string {
        const columns = map(this.columnControllers, columnController => columnController.getSafeName());
        const otherColumns = map(this.otherColumnControllers, columnController => columnController.getSafeName());
        return `ALTER TABLE ${this.tableController.getFullSafeName()} ADD CONSTRAINT ${this.getSafeName()} FOREIGN KEY (${join(columns, ', ')}) REFERENCES ${this.otherTableController.getFullSafeName()} (${join(otherColumns, ', ')});\n`;
    }

    drop(): string {
        return `ALTER TABLE ${this.tableController.getFullSafeName()} DROP CONSTRAINT ${this.getSafeName()};\n`;
    }

    getDependencies(): string[] {
        return [
            this.tableController.getId(),
            ...map(this.columnControllers, columnController => columnController.getId()),
            this.otherTableController.getId(),
            ...map(this.otherColumnControllers, columnController => columnController.getId())
        ];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof ForeignKeyConstraintController) {
            return (
                this.foreignKeyConstraint.name === toMatch.foreignKeyConstraint.name &&
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
                ).length === 0 &&
                this.otherTableController.match(toMatch.otherTableController) &&
                // Check the difference both ways as the method only returns
                // elements from the first array
                differenceWith(
                    this.otherColumnControllers,
                    toMatch.otherColumnControllers,
                    (left, right) => left.match(right)
                ).length === 0 &&
                differenceWith(
                    toMatch.otherColumnControllers,
                    this.otherColumnControllers,
                    (left, right) => left.match(right)
                ).length === 0
            );
        }
        return false;
    }

    getId(): string {
        return this.foreignKeyConstraint.id;
    }
}
