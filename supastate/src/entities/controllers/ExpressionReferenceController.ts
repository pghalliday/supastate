import {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import {TABLE_TYPE} from "../models/Table.js";
import {TableController} from "./TableController.js";
import {COLUMN_TYPE} from "../models/Column.js";
import {ColumnController} from "./ColumnController.js";
import {Entity} from "../models/Entity.js";
import {AssertionError} from "node:assert";

export interface ExpressionReferenceController extends EntityController {
    getExpressionName(): string;
}

export function createExpressionReferenceController(expressionReference: Entity, entities: Entities): ExpressionReferenceController {
    switch (expressionReference.entityType) {
        case TABLE_TYPE:
            return new TableController(expressionReference, entities);
        case COLUMN_TYPE:
            return new ColumnController(expressionReference, entities);
        default:
            throw new AssertionError({
                message: `Entity ${expressionReference.id} with type ${expressionReference.entityType} cannot be used as an expression reference`
            });
    }
}
