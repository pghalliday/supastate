import {Column, Entities, Table} from "@pghalliday/supastate/entities";
import {ColumnController, TableController} from "@pghalliday/supastate/controllers";
import assert from "node:assert";

export class Select {
    private tableController?: TableController;
    private values: string[] = [];

    constructor(private readonly entities: Entities) {
    }

    column(column: Column): Select {
        const columnController = new ColumnController(column, this.entities);
        this.values.push(columnController.getFullSafeName());
        return this;
    }
    value(val: string): Select {
        this.values.push(val);
        return this;
    }

    from(table: Table): Select {
        this.tableController = new TableController(table, this.entities);
        return this;
    }

    build(): string {
        assert(this.tableController);
        return `SELECT ${this.values.join(', ')} FROM ${this.tableController.getFullSafeName()}`
    }
}
