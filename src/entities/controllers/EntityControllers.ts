import {createEntityController, EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import _ from "lodash";

const {forIn} = _;

export type EntityControllers = Record<string, EntityController>;

export function initEntityControllers(entities: Entities): EntityControllers {
    const entityControllers: EntityControllers = {};
    forIn(entities, (entity, id) => {
        entityControllers[id] = createEntityController(entity, entities);
    });
    return entityControllers;
}
