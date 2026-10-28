export const ROLES=["platform_admin","owner","worker"] as const;export type Role=typeof ROLES[number];
export const permissions={platform_admin:["platform:read","platform:manage"],owner:["orders:read","orders:write","cash:manage","staff:manage"],worker:["orders:read","orders:write"]} as const;
export function isKnownRole(value:string):value is Role{return ROLES.some(role=>role===value)}
