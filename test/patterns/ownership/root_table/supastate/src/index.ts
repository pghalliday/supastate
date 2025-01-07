import {Supastate, RootTableFactory} from "@pghalliday/supastate";

export function configure(supastate: Supastate): void {
    const authSchema = supastate.addSchema({name: 'auth', external: true});
    const s1Schema = supastate.addSchema({name: 's1'});

    const rootTableFactory = new RootTableFactory(supastate);

    const usersTable = rootTableFactory.addRootTable({
        name: 'users',
        schema: authSchema,
        primaryKeyColumnName: 'id',
        primaryKeyColumnType: 'uuid',
        external: true,
    });

    const s1t1RootTable = rootTableFactory.addRootTable({
        name: 't1_root',
        schema: s1Schema,
        primaryKeyColumnName: 'id',
        primaryKeyColumnType: 'uuid',
    });
}
