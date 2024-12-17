import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import _ from "lodash";
import {SCHEMA_TYPE} from "../models/Schema.js";
import {TABLE_TYPE} from "../models/Table.js";
import type {Entity} from "../models/Entity.js";
import {TableController} from "./TableController.js";
import {SchemaController} from "./SchemaController.js";
import {RLS_ENABLED_TYPE} from "../models/RLSEnabled.js";
import {RLSEnabledController} from "./RLSEnabledController.js";
import {COLUMN_TYPE} from "../models/Column.js";
import {ColumnController} from "./ColumnController.js";
import {PRIMARY_KEY_CONSTRAINT_TYPE} from "../models/PrimaryKeyConstraint.js";
import {PrimaryKeyConstraintController} from "./PrimaryKeyConstraintController.js";

const {forIn} = _;

export type EntityControllers = Record<string, EntityController>;

function createEntityController(entity: Entity, entities: Entities): EntityController {
    switch (entity.entityType) {
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
        default:
            const _exhaustiveCheck: never = entity;
            return _exhaustiveCheck;
    }
}

export function initEntityControllers(entities: Entities): EntityControllers {
    const entityControllers: EntityControllers = {};
    forIn(entities, (entity, id) => {
        entityControllers[id] = createEntityController(entity, entities);
    });
    return entityControllers;
}
