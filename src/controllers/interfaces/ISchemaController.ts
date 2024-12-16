import type {IEntityController} from "./IEntityController.js";
import {type Schema, SCHEMA_TYPE} from "../../models/Schema.js";

export interface ISchemaController extends IEntityController {
    type: typeof SCHEMA_TYPE;
    schema: Schema;
}

