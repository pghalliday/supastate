import {Table} from "../../../entities/models/Table.js";
import {Column} from "../../../entities/models/Column.js";
import {PrimaryKeyConstraint} from "../../../entities/models/PrimaryKeyConstraint.js";
import {RLSEnabled} from "../../../entities/models/RLSEnabled.js";

export interface OwnerTable {
    table: Table;
    primaryKeyColumn: Column;
    primaryKeyConstraint: PrimaryKeyConstraint;
    rlsSetting: RLSEnabled;
}
