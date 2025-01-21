import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import assert from "node:assert";
import {TableController} from "./TableController.js";
import {Entity} from "../models/Entity.js";
import {Policy, POLICY_TYPE} from "../models/Policy.js";
import {createPolicyToController, PolicyToController} from "../../util/controllers/PolicyToController.js";
import _ from "lodash";
import {ExpressionController} from "../../util/controllers/ExpressionController.js";
const {map, flatMap, xorWith, join} = _;

export class PolicyController implements EntityController {
    private readonly policy: Policy;
    private readonly tableController: TableController;
    private readonly policyToControllers: PolicyToController[];
    private readonly usingExpressionController?: ExpressionController;
    private readonly withCheckExpressionController?: ExpressionController;

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
        if (this.policy.using !== undefined) {
            this.usingExpressionController = new ExpressionController(this.policy.using, entities);
        }
        if (this.policy.withCheck !== undefined) {
            this.withCheckExpressionController = new ExpressionController(this.policy.withCheck, entities);
        }
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
        const asClause = (this.policy.as === undefined) ? '' : `AS ${this.policy.as} `;
        const forClause = (this.policy.for === undefined) ? '' : `FOR ${this.policy.for} `;
        const toClause = (this.policyToControllers.length === 0) ? '' : `TO ${join(map(this.policyToControllers, policyToController => policyToController.getText()), ', ')} `;
        const usingClause = (this.usingExpressionController === undefined) ? '' : `USING (${this.usingExpressionController.compile()}) `;
        const withCheckClause = (this.withCheckExpressionController === undefined) ? '' : `WITH CHECK (${this.withCheckExpressionController.compile()}) `;
        return (
            `CREATE POLICY ${this.getSafeName()} ` +
            `ON ${this.tableController.getFullSafeName()} ` +
            asClause +
            forClause +
            toClause +
            usingClause +
            withCheckClause +
            `;\n`
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
            ...((this.usingExpressionController === undefined) ? [] : this.usingExpressionController.getDependencies()),
            ...((this.withCheckExpressionController === undefined) ? [] : this.withCheckExpressionController.getDependencies()),
        ];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof PolicyController) {
            return (
                (this.policy.name === toMatch.policy.name) &&
                (this.policy.as === toMatch.policy.as) &&
                (this.policy.for === toMatch.policy.for) &&
                this.tableController.match(toMatch.tableController) &&
                (
                    (
                        this.usingExpressionController === undefined &&
                        toMatch.usingExpressionController === undefined
                    ) ||
                    (
                        this.usingExpressionController !== undefined &&
                        toMatch.usingExpressionController !== undefined &&
                        this.usingExpressionController.match(toMatch.usingExpressionController)
                    )
                ) &&
                (
                    (
                        this.withCheckExpressionController === undefined &&
                        toMatch.withCheckExpressionController === undefined
                    ) ||
                    (
                        this.withCheckExpressionController !== undefined &&
                        toMatch.withCheckExpressionController !== undefined &&
                        this.withCheckExpressionController.match(toMatch.withCheckExpressionController)
                    )
                ) &&
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
