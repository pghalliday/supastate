import {ForeignKeyConstraint} from "../../../entities/models/ForeignKeyConstraint.js";
import {OwnerTable} from "./OwnerTable.js";

export interface InformationTable extends OwnerTable {
    foreignKeyConstraint: ForeignKeyConstraint;
}
