import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import assert from "node:assert";
import {TableController} from "./TableController.js";
import {Entity} from "../models/Entity.js";
import {Policy, POLICY_TYPE} from "../models/Policy.js";
import {createPolicyToController, PolicyToController} from "./PolicyToController.js";
import _ from "lodash";
import {ExpressionController} from "./ExpressionController.js";
const {map, flatMap, xorWith, join} = _;

export class PolicyController implements EntityController {
    private readonly policy: Policy;
    private readonly tableController: TableController;
    private readonly policyToControllers: PolicyToController[];
    private readonly usingExpressionController: ExpressionController;
    private readonly withCheckExpressionController: ExpressionController;

    constructor(
        readonly entity: Entity,
        readonly entities: Entities,
    ) {
        assert(entity.entityType === POLICY_TYPE);
        this.policy = entity;
        const table = entities[this.policy.tableId];
        this.tableController = new TableController(table, entities);
        this.policyToControllers = map(
            this.policy.to,
            policyTo => createPolicyToController(policyTo, entities)
        );
        this.usingExpressionController = new ExpressionController(this.policy.using, entities);
        this.withCheckExpressionController = new ExpressionController(this.policy.withCheck, entities);
    }

    getId(): string {
        return this.policy.id;
    }

    getSafeName(): string {
        return `"${this.policy.name}"`;
    }

    isExternal(): boolean {
        return this.policy.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof PolicyController);
        // nothing in policies to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof PolicyController);
        // nothing in policies to alter after creates
        return '';
    }

    create(): string {
        return (
            `CREATE POLICY ${this.getSafeName()} ` +
            `ON ${this.tableController.getFullSafeName()} ` +
            `AS ${this.policy.as} ` +
            `FOR ${this.policy.for} ` +
            `TO ${join(map(this.policyToControllers, policyToController => policyToController.getText()), ', ')} ` +
            `USING (${this.usingExpressionController.compile()}) ` +
            `WITH CHECK (${this.withCheckExpressionController.compile()});\n`
        );
    }

    drop(): string {
        return (
            `DROP POLICY ${this.getSafeName()} ` +
            `ON ${this.tableController.getFullSafeName()};\n`
        );
    }

    getDependencies(): string[] {
        return [
            this.tableController.getId(),
            ...flatMap(
                this.policyToControllers,
                policyToController => policyToController.getDependencies()
            ),
            ...this.usingExpressionController.getDependencies(),
            ...this.withCheckExpressionController.getDependencies(),
        ];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof PolicyController) {
            return (
                (this.policy.name === toMatch.policy.name) &&
                (this.policy.as === toMatch.policy.as) &&
                (this.policy.for === toMatch.policy.for) &&
                this.tableController.match(toMatch.tableController) &&
                this.usingExpressionController.match(toMatch.usingExpressionController) &&
                this.withCheckExpressionController.match(toMatch.withCheckExpressionController) &&
                xorWith(
                    this.policyToControllers,
                    toMatch.policyToControllers,
                    (first, second) => first.match(second)
                ).length === 0
            );
        }
        return false;
    }
}
