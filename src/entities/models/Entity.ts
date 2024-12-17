import {type Schema} from "./Schema.js";
import {type Table} from "./Table.js";
import {RLSEnabled} from "./RLSEnabled.js";
import {Column} from "./Column.js";
import {PrimaryKeyConstraint} from "./PrimaryKeyConstraint.js";
import {ForeignKeyConstraint} from "./ForeignKeyConstraint.js";
import {NotNullConstraint} from "./NotNullConstraint.js";

export type Entity =
    Schema |
    Table |
    RLSEnabled |
    Column |
    PrimaryKeyConstraint |
    ForeignKeyConstraint |
    NotNullConstraint
