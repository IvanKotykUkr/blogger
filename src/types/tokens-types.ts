import {WithId} from "mongodb";

export type TokensType = WithId<{
    token: string,
    addedAt: number
}>