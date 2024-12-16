import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import _ from "lodash";
import {SCHEMA_TYPE} from "../models/Schema.js";
import {TABLE_TYPE} from "../models/Table.js";
import type {Entity} from "../models/Entity.js";
import {TableController} from "./TableController.js";
import {SchemaController} from "./SchemaController.js";
const {forIn} = _;

export type EntityControllers = Record<string, EntityController>;

function createEntityController(entity: Entity, entities: Entities): EntityController {
    switch (entity.type) {
        case SCHEMA_TYPE:
            return new SchemaController(entity);
        case TABLE_TYPE:
            return new TableController(entity, entities);
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
