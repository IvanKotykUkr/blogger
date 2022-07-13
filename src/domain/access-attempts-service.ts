import {accessAttemptsDbRepositories, RecordType} from "../repositories/access-attempts-db-repositories";

export const accessAttemptsService = {
    async countNumber(timeRequest:any){
        const tooMach="too mach"
        const countTimeRequest = timeRequest[5]-(timeRequest[0])

        if(countTimeRequest<=10000){
            return  tooMach
        }
        return


    },

    async countAttempts(ip: string, date: Date, process:string) {

        const createRecord: RecordType = {
            ip,
            date,
            process
        }
        const timeRequest = await accessAttemptsDbRepositories.createRecord(createRecord)
        return await this.countNumber(timeRequest)

    },

}