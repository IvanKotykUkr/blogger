import {TrafficModelClass} from "./db";
import {ObjectId} from "mongodb";
import {RecordType} from "../types/traffic-type";
import {injectable} from "inversify";
import "reflect-metadata";
@injectable()
export class AccessAttemptsRepositories {
    async countDate(record: RecordType) {
        const ipFound = await TrafficModelClass.find({"ip": record.ip, "process": record.process}).lean()


        return ipFound.map(val => (val.date)).slice(Math.max(ipFound.length - 6, 0))

    }


    async createRecord(record: RecordType) {
        const recordInstance = new TrafficModelClass
        recordInstance._id = new ObjectId()
        recordInstance.ip = record.ip
        recordInstance.date = record.date,
            recordInstance.process = record.process
        await recordInstance.save()


        return await this.countDate(recordInstance)


    }

}


