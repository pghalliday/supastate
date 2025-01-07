import {Supastate} from "@pghalliday/supastate";

export function configure(supastate: Supastate): void {
    const authSchema = supastate.addSchema({name: 'auth', external: true});
    const usersTable = supastate.addTable({name: 'users', schema: authSchema, external: true});
    const usersIdColumn = supastate.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});
    const publicSchema = supastate.addSchema({name: 'public', external: true});
    const publicT1Table = supastate.addTable({name: 't1', schema: publicSchema});
    const publicT1IdColumn = supastate.addColumn({table: publicT1Table, name: 'id', type: 'uuid'});
    const s1Schema = supastate.addSchema({name: 's1'});
    const s1T1Table = supastate.addTable({name: 't1', schema: s1Schema});
    const s1T1IdColumn = supastate.addColumn({table: s1T1Table, name: 'id', type: 'uuid'});
}
