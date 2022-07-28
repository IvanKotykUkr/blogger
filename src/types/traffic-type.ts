import {WithId} from "mongodb";

export type RecordType = WithId<{
    ip: string,
    date: Date,
    process: string
}>