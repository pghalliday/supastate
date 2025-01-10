import {PolicyTo} from "../models/PolicyTo.js";
import {PolicyToController} from "./PolicyToController.js";

export class PolicyToBuiltInController implements PolicyToController {
    constructor(private readonly policyTo: PolicyTo) {
    }

    getText(): string {
        return this.policyTo.type;
    }

    getDependencies(): string[] {
        return [];
    }

    match(toMatch: PolicyToController): boolean {
        if (toMatch instanceof PolicyToBuiltInController) {
            return this.policyTo.type === toMatch.policyTo.type;
        }
        return false;
    }
}
