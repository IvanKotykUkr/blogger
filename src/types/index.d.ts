import {UserDBtype} from "../repositories/types";

declare global{
    declare namespace Express{
        export interface Request{
            user:any
        }
    }
}