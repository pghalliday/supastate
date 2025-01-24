import {Column, Entities, Table} from "@pghalliday/supastate/entities";
import {ColumnController, TableController} from "@pghalliday/supastate/controllers";
import assert from "node:assert";

export class Update {
    private tableController?: TableController;
    private ret?: number;
    private setClauses: string[] = [];

    constructor(private readonly entities: Entities) {
    }

    table(table: Table): Update {
        this.tableController = new TableController(table, this.entities);
        return this;
    }

    set(column: Column, textVal: string): Update {
        const columnController = new ColumnController(column, this.entities);
        this.setClauses.push(`${columnController.getSafeName()} = '${textVal}'`)
        return this;
    }

    returning(ret: number): Update {
        this.ret = ret;
        return this;
    }

    build(): string {
        assert(this.tableController);
        assert(this.ret !== undefined);
        return `UPDATE ${this.tableController.getFullSafeName()} SET ${this.setClauses.join(', ')} RETURNING ${this.ret}`;
    }
}
