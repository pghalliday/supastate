import {Role} from "./Role.js";

export const POLICY_TO_ROLE_TYPE = "role";
export const POLICY_TO_PUBLIC_TYPE = "PUBLIC";
export const POLICY_TO_CURRENT_ROLE_TYPE = "CURRENT_ROLE";
export const POLICY_TO_CURRENT_USER_TYPE = "CURRENT_USER";
export const POLICY_TO_SESSION_USER_TYPE = "SESSION_USER";

export interface PolicyToRole {
    type: typeof POLICY_TO_ROLE_TYPE;
    roleId: string;
}

export interface PolicyToPublic {
    type: typeof POLICY_TO_PUBLIC_TYPE;
}

export interface PolicyToCurrentRole {
    type: typeof POLICY_TO_CURRENT_ROLE_TYPE;
}

export interface PolicyToCurrentUser {
    type: typeof POLICY_TO_CURRENT_USER_TYPE;
}

export interface PolicyToSessionUser {
    type: typeof POLICY_TO_SESSION_USER_TYPE;
}

export type PolicyTo =
    PolicyToRole |
    PolicyToPublic |
    PolicyToCurrentRole |
    PolicyToCurrentUser |
    PolicyToSessionUser;

export type PolicyToBuiltIn =
    typeof POLICY_TO_PUBLIC_TYPE |
    typeof POLICY_TO_CURRENT_ROLE_TYPE |
    typeof POLICY_TO_CURRENT_USER_TYPE |
    typeof POLICY_TO_SESSION_USER_TYPE;

export function policyToRole(role: Role): PolicyTo {
    return {
        type: POLICY_TO_ROLE_TYPE,
        roleId: role.id,
    };
}

export function policyToBuiltIn(builtIn: PolicyToBuiltIn): PolicyTo {
    return {
        type: builtIn,
    };
}
