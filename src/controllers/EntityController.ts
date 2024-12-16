import type {ISchemaController} from "./interfaces/ISchemaController.js";
import type {ITableController} from "./interfaces/ITableController.js";

export type EntityController =
    ISchemaController |
    ITableController;
