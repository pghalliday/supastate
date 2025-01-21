import {Entities} from "../../entities/models/Entities.js";
import {POLICY_TO_ROLE_TYPE, PolicyTo} from "../models/PolicyTo.js";
import {RoleController} from "../../entities/controllers/RoleController.js";
import assert from "node:assert";
import {PolicyToController} from "./PolicyToController.js";

export class PolicyToRoleController implements PolicyToController {
    private readonly roleController: RoleController;

    constructor(readonly policyTo: PolicyTo, readonly entities: Entities) {
        assert(policyTo.type === POLICY_TO_ROLE_TYPE);
        this.roleController = new RoleController(entities[policyTo.roleId]);
    }

    getText(): string {
        return this.roleController.getSafeName();
    }

    getDependencies(): string[] {
        return [this.roleController.getId()];
    }

    match(toMatch: PolicyToController): boolean {
        if (toMatch instanceof PolicyToRoleController) {
            return this.roleController.match(toMatch.roleController);
        }
        return false;
    }
}
