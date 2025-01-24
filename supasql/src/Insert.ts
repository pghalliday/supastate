import {Entities, Column, Table} from "@pghalliday/supastate/entities";
import assert from "node:assert";
import {TableController, ColumnController} from "@pghalliday/supastate/controllers";
import _ from "lodash";

const {map} = _;

export class Insert {
    private tableController?: TableController;
    private columnControllers?: ColumnController[];
    private rows: string[][] = [];

    constructor(private readonly entities: Entities) {
    }

    into(table: Table): Insert {
        this.tableController = new TableController(table, this.entities);
        return this;
    }

    columns(cols: Column[]): Insert {
        this.columnControllers = map(cols, col => new ColumnController(col, this.entities));
        return this;
    }

    values(vals: string[]): Insert {
        this.rows.push(vals);
        return this;
    }

    build(): string {
        assert(this.tableController);
        assert(this.columnControllers);
        return `
INSERT INTO ${this.tableController.getFullSafeName()}
    (${map(this.columnControllers, columnController => columnController.getSafeName()).join(', ')})
VALUES
    ${map(this.rows, vals => `(${vals.join(', ')})`).join(',\n    ')}
`;
    }
}
