export {Insert} from "./Insert.js";

export function getSupabaseUID(userIdentifier: string): string {
    return `tests.get_supabase_uid('${userIdentifier}')`;
}
