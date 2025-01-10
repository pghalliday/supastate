import {type Role, ROLE_TYPE} from "../models/Role.js";
import assert from "node:assert";
import type {EntityController} from "./EntityController.js";
import {Entity} from "../models/Entity.js";

export class RoleController implements EntityController {
    private readonly role: Role;

    constructor(
        readonly entity: Entity,
    ) {
        assert(entity.entityType === ROLE_TYPE);
        this.role = entity;
    }

    getId(): string {
        return this.role.id;
    }

    getSafeName(): string {
        return `"${this.role.name}"`;
    }

    isExternal(): boolean {
        return this.role.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof RoleController);
        // nothing in roles to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof RoleController);
        // nothing in roles to alter after creates
        return '';
    }

    create(): string {
        return `CREATE ROLE ${this.getSafeName()};\n`;
    }

    drop(): string {
        return `DROP ROLE ${this.getSafeName()};\n`;
    }

    getDependencies(): string[] {
        return [];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof RoleController) {
            return (
                this.role.name === toMatch.role.name
            );
        }
        return false;
    }
}
