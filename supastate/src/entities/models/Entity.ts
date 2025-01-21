import {Schema} from "./Schema.js";
import {RLSEnabled} from "./RLSEnabled.js";
import {PrimaryKeyConstraint} from "./PrimaryKeyConstraint.js";
import {ForeignKeyConstraint} from "./ForeignKeyConstraint.js";
import {NotNullConstraint} from "./NotNullConstraint.js";
import {Policy} from "./Policy.js";
import {Role} from "./Role.js";
import {ExpressionReference} from "./ExpressionReference.js";

export type Entity =
    ExpressionReference |
    Role |
    Schema |
    RLSEnabled |
    PrimaryKeyConstraint |
    ForeignKeyConstraint |
    NotNullConstraint |
    Policy
