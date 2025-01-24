import {Column, Entities} from "@pghalliday/supastate/entities";
import {Insert} from "./Insert.js";
import {ColumnController} from "@pghalliday/supastate/controllers";
import {Supastate} from "@pghalliday/supastate";
import {Select} from "./Select.js";
import {Update} from "./Update.js";
import {Delete} from "./Delete.js";

export class Supasql {
    knownEntities: Entities = {};

    addSupastate(supastate: Supastate) {
        this.knownEntities = {
            ...this.knownEntities,
            ...supastate.entities
        };
    }

    select(): Select {
        return new Select(this.knownEntities);
    }

    insert(): Insert {
        return new Insert(this.knownEntities);
    }

    update(): Update {
        return new Update(this.knownEntities);
    }

    delete(): Delete {
        return new Delete(this.knownEntities);
    }

    equal(column: Column, val: string): string {
        const columnController = new ColumnController(column, this.knownEntities);
        return `${columnController.getFullSafeName()} = ${val}`;
    }

    getSupabaseUID(userIdentifier: string): string {
        return `tests.get_supabase_uid('${userIdentifier}')`;
    }

    toUuid(identifier: string): string {
        return `st_uuid('${identifier}')`;
    }

    fromUuid(column: Column): string {
        const columnController = new ColumnController(column, this.knownEntities);
        return `st_uuid(${columnController.getFullSafeName()})`;
    }
}
