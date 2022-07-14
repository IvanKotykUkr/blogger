import {accessAttemptsDbRepositories, RecordType} from "../repositories/access-attempts-db-repositories";

export const accessAttemptsService = {
    async countNumber(timeRequest:any):Promise<string>{
        const tooMach="too mach"
        const allOk="all ok"
        const countTimeRequest = timeRequest[5]-(timeRequest[0])

        if(countTimeRequest<=10000){
            return  tooMach
        }
        return allOk


    },

    async countAttempts(ip: string, date: Date, process:string):Promise<string> {

        const createRecord: RecordType = {
            ip,
            date,
            process
        }
        const timeRequest = await accessAttemptsDbRepositories.createRecord(createRecord)
        return await this.countNumber(timeRequest)

    },

}