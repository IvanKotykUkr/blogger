import * as QueryString from "querystring";
import {ObjectId, WithId} from "mongodb";
export type BloggerDBType=WithId<{
    name: string,
    youtubeUrl: string,

}>

export type BloggerType = {
    id?:ObjectId,
    _id?: ObjectId,
    name: string,
    youtubeUrl: string,
}
export type BloggerPayloadType = Omit<BloggerResponseType, 'id'>
export type BloggerResponseType = {
    id: ObjectId|undefined,
    name: string,
    youtubeUrl: string,
}
export type PaginationType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[],

}
export type BloggerResponseTypeWithPagination = PaginationType<BloggerResponseType>