import _ from "lodash";
import {ExpressionReference} from "./ExpressionReference.js";
const {mapValues} = _;

export interface Expression {
    template: string;
    entityIds: Record<string, string>;
}

export function expression(template: string, expressionReferences: Record<string, ExpressionReference>): Expression {
    return {
        template,
        entityIds: mapValues(expressionReferences, entity => entity.id),
    };
}
