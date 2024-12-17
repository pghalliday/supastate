import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import assert from "node:assert";
import {ColumnController} from "./ColumnController.js";
import {Entity} from "../models/Entity.js";
import {NOT_NULL_CONSTRAINT_TYPE, NotNullConstraint} from "../models/NotNullConstraint.js";

export class NotNullConstraintController implements EntityController {
    private readonly notNullConstraint: NotNullConstraint;
    private readonly columnController: ColumnController;

    constructor(
        readonly entity: Entity,
        readonly entities: Entities,
    ) {
        assert(entity.entityType === NOT_NULL_CONSTRAINT_TYPE);
        this.notNullConstraint = entity;
        const column = entities[this.notNullConstraint.columnId];
        this.columnController = new ColumnController(column, entities);
    }

    isExternal(): boolean {
        return this.notNullConstraint.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof NotNullConstraintController);
        // nothing in not null constraints to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof NotNullConstraintController);
        // nothing in not null constraints to alter after creates
        return '';
    }

    create(): string {
        return `ALTER TABLE ${this.columnController.getTableFullSafeName()} ALTER COLUMN ${this.columnController.getSafeName()} SET NOT NULL;\n`;
    }

    drop(): string {
        return `ALTER TABLE ${this.columnController.getTableFullSafeName()} ALTER COLUMN ${this.columnController.getSafeName()} DROP NOT NULL;\n`;
    }

    getDependencies(): string[] {
        return [
            this.columnController.getId(),
        ];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof NotNullConstraintController) {
            return (
                this.columnController.match(toMatch.columnController)
            );
        }
        return false;
    }
}
