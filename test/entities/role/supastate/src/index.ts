import {Supastate} from "@pghalliday/supastate";

export function configure(supastate: Supastate): void {
    const authenticatedRole = supastate.addRole({name: 'authenticated', external: true});
    const s1Schema = supastate.addRole({name: 'r1'});
}
