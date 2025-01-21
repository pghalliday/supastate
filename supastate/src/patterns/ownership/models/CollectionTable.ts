import {OwnerTable} from "./OwnerTable.js";
import {Column} from "../../../entities/models/Column.js";
import {ForeignKeyConstraint} from "../../../entities/models/ForeignKeyConstraint.js";

export interface CollectionTable extends OwnerTable {
    foreignKeyColumn: Column;
    foreignKeyConstraint: ForeignKeyConstraint;
}
