import {Supastate} from "@pghalliday/supastate";

export function configure(supastate: Supastate): void {
    const authSchema = supastate.addSchema({name: 'auth', external: true});
    const s1Schema = supastate.addSchema({name: 's1'});
}
