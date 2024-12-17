import {Table} from "../../../entities/models/Table.js";
import {Column} from "../../../entities/models/Column.js";
import {PrimaryKeyConstraint} from "../../../entities/models/PrimaryKeyConstraint.js";
import {RLSEnabled} from "../../../entities/models/RLSEnabled.js";
import {ForeignKeyConstraint} from "../../../entities/models/ForeignKeyConstraint.js";

export interface InformationTable {
    table: Table;
    foreignKeyColumn: Column;
    primaryKeyConstraint: PrimaryKeyConstraint;
    foreignKeyConstraint: ForeignKeyConstraint;
    rlsSetting: RLSEnabled;
}
