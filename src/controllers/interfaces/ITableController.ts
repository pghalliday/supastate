import type {IEntityController} from "./IEntityController.js";
import type {Table, TABLE_TYPE} from "../../models/Table.js";
import type {ISchemaController} from "./ISchemaController.js";

export interface ITableController extends IEntityController {
    type: typeof TABLE_TYPE;
    table: Table;
    schemaController: ISchemaController;
}
