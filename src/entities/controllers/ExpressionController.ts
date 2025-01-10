import Mustache from "mustache";
import _ from "lodash";
import {Expression} from "../models/Expression.js";
import {Entities} from "../models/Entities.js";
import {createExpressionReferenceController, ExpressionReferenceController} from "./ExpressionReferenceController.js";
const {mapValues, map, isEqualWith} = _;

export class ExpressionController {
    private readonly template: string;
    private readonly expressionReferenceControllers: Record<string, ExpressionReferenceController>;

    constructor(readonly expression: Expression, readonly entities: Entities) {
        this.template = expression.template;
        this.expressionReferenceControllers = mapValues(
            this.expression.entityIds,
            entityId => createExpressionReferenceController(
                this.entities[entityId],
                this.entities,
            )
        );
    }

    compile(): string {
        return Mustache.render(
            this.template,
            mapValues(
                this.expressionReferenceControllers,
                entityController => entityController.getExpressionName()
            ),
        );
    }

    getDependencies(): string[] {
        return map(
            this.expressionReferenceControllers,
            entityController => entityController.getId()
        );
    }

    match(toMatch: ExpressionController): boolean {
        return (
            this.template === toMatch.template &&
            isEqualWith(
                this.expressionReferenceControllers,
                toMatch.expressionReferenceControllers,
                (first, second) => first.match(second)
            )
        );
    }
}
