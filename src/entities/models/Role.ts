import {v4} from "uuid";

export const ROLE_TYPE = 'role';

export interface Role {
    entityType: typeof ROLE_TYPE;
    id: string;
    name: string;
    external: boolean;
}

export interface RoleParams {
    name: string;
    external?: boolean;
}

export function initRole(params: RoleParams): Role {
    return {
        entityType: ROLE_TYPE,
        id: v4(),
        name: params.name,
        external: params.external || false,
    };
}
