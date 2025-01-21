import {OwnerTable} from "./OwnerTable.js";
import {Column} from "../../../entities/models/Column.js";
import {ForeignKeyConstraint} from "../../../entities/models/ForeignKeyConstraint.js";

export interface MembershipTable extends OwnerTable {
    memberColumn: Column;
    memberForeignKeyConstraint: ForeignKeyConstraint;
    groupColumn: Column;
    groupForeignKeyConstraint: ForeignKeyConstraint;
}
