import type {EntityController} from "./EntityController.js";
import type {Entities} from "../models/Entities.js";
import assert from "node:assert";
import {TableController} from "./TableController.js";
import {RLS_ENABLED_TYPE, RLSEnabled} from "../models/RLSEnabled.js";
import {Entity} from "../models/Entity.js";

export class RLSEnabledController implements EntityController {
    private readonly rlsEnabled: RLSEnabled;
    private readonly tableController: TableController;

    constructor(
        readonly entity: Entity,
        readonly entities: Entities,
    ) {
        assert(entity.entityType === RLS_ENABLED_TYPE);
        this.rlsEnabled = entity;
        const table = entities[this.rlsEnabled.tableId];
        this.tableController = new TableController(table, entities);
    }

    forceOrEnable(): string {
        return this.rlsEnabled.force ? 'FORCE' : 'ENABLE';
    }

    isExternal(): boolean {
        return this.rlsEnabled.external;
    }

    alterDrop(target: EntityController): string {
        assert(target instanceof RLSEnabledController);
        // nothing in RLS settings to alter before drops
        return '';
    }

    alterCreate(current: EntityController): string {
        assert(current instanceof RLSEnabledController);
        // Check if the force flag has changed
        if (this.rlsEnabled.force !== current.rlsEnabled.force) {
            return this.create();
        }
        return '';
    }

    create(): string {
        return `ALTER TABLE ${this.tableController.getFullSafeName()} ${this.forceOrEnable()} ROW LEVEL SECURITY;\n`;
    }

    drop(): string {
        return `ALTER TABLE ${this.tableController.getFullSafeName()} DISABLE ROW LEVEL SECURITY;\n`;
    }

    getDependencies(): string[] {
        return [this.tableController.getId()];
    }

    match(toMatch: EntityController): boolean {
        if (toMatch instanceof RLSEnabledController) {
            return (
                this.tableController.match(toMatch.tableController)
            );
        }
        return false;
    }

    getId(): string {
        return this.rlsEnabled.id;
    }
}
