export const providers = ["github"] as const
export type Provider = (typeof providers)[number]
