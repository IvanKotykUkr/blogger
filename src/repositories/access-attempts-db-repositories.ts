import {trafficCollection} from "./db";
import {ObjectId} from "mongodb";


export type RecordType = {
    ip: string,
    date: Date
    process:string
}

export const accessAttemptsDbRepositories = {
    async countDate(record:RecordType){
        const ipFound = await trafficCollection.find({"ip": record.ip,"process":record.process}).toArray()


        return ipFound.map(val => (val.date)).slice(Math.max(ipFound.length - 6, 0))

    } ,



    async createRecord(record: RecordType) {
        await trafficCollection.insertOne(record)
        return await this.countDate(record)



    }
}