import {Entities, Table} from "@pghalliday/supastate/entities";
import {TableController} from "@pghalliday/supastate/controllers";
import assert from "node:assert";

export class Delete {
    private tableController?: TableController;
    private condition?: string;
    private ret?: number;

    constructor(private readonly entities: Entities) {
    }

    from(table: Table): Delete {
        this.tableController = new TableController(table, this.entities);
        return this;
    }

    where(condition: string): Delete {
        this.condition = condition;
        return this;
    }

    returning(ret: number): Delete {
        this.ret = ret;
        return this;
    }

    build(): string {
        assert(this.tableController);
        let sql = `
DELETE from ${this.tableController.getFullSafeName()}
`;
        if (this.condition !== undefined) {
            sql += `WHERE ${this.condition}
`;
        }
        if (this.ret !== undefined) {
            sql += `RETURNING ${this.ret}
`;
        }
        return sql;
    }
}
