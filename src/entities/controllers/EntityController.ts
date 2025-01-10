import type {Entity} from "../models/Entity.js";
import type {Entities} from "../models/Entities.js";
import {ROLE_TYPE} from "../models/Role.js";
import {RoleController} from "./RoleController.js";
import {SCHEMA_TYPE} from "../models/Schema.js";
import {SchemaController} from "./SchemaController.js";
import {TABLE_TYPE} from "../models/Table.js";
import {TableController} from "./TableController.js";
import {RLS_ENABLED_TYPE} from "../models/RLSEnabled.js";
import {RLSEnabledController} from "./RLSEnabledController.js";
import {COLUMN_TYPE} from "../models/Column.js";
import {ColumnController} from "./ColumnController.js";
import {PRIMARY_KEY_CONSTRAINT_TYPE} from "../models/PrimaryKeyConstraint.js";
import {PrimaryKeyConstraintController} from "./PrimaryKeyConstraintController.js";
import {FOREIGN_KEY_CONSTRAINT_TYPE} from "../models/ForeignKeyConstraint.js";
import {ForeignKeyConstraintController} from "./ForeignKeyConstraintController.js";
import {NOT_NULL_CONSTRAINT_TYPE} from "../models/NotNullConstraint.js";
import {NotNullConstraintController} from "./NotNullConstraintController.js";
import {POLICY_TYPE} from "../models/Policy.js";
import {PolicyController} from "./PolicyController.js";

export interface EntityController {
    getId(): string;
    isExternal(): boolean;
    match(toMatch: EntityController): boolean;
    drop(): string;
    create(): string;
    alterDrop(target: EntityController): string;
    alterCreate(current: EntityController): string;
    getDependencies(): string[];
}

export function createEntityController(entity: Entity, entities: Entities): EntityController {
    switch (entity.entityType) {
        case ROLE_TYPE:
            return new RoleController(entity);
        case SCHEMA_TYPE:
            return new SchemaController(entity);
        case TABLE_TYPE:
            return new TableController(entity, entities);
        case RLS_ENABLED_TYPE:
            return new RLSEnabledController(entity, entities);
        case COLUMN_TYPE:
            return new ColumnController(entity, entities);
        case PRIMARY_KEY_CONSTRAINT_TYPE:
            return new PrimaryKeyConstraintController(entity, entities);
        case FOREIGN_KEY_CONSTRAINT_TYPE:
            return new ForeignKeyConstraintController(entity, entities);
        case NOT_NULL_CONSTRAINT_TYPE:
            return new NotNullConstraintController(entity, entities);
        case POLICY_TYPE:
            return new PolicyController(entity, entities);
        default:
            const _exhaustiveCheck: never = entity;
            return _exhaustiveCheck;
    }
}
