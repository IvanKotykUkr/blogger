import {UserType} from "../types/user-type";
import {emailAdapter} from "../adapters/email-adapter";

export const emailManager={

    async conFirmaTionCode(user:UserType){
        return user.emailConfirmation.confirmationCode

    },
    async sendEmailConfirmationMessage(user:UserType,url:any){
        const code=await this.conFirmaTionCode(user)
       await emailAdapter.sendEmail(user.accountData.email,"registration",url+`?${code}=youtcodehere`)
       return
    },
    async resentEmailConfirmationMessage(user: UserType,url:any) {

        const code=await this.conFirmaTionCode(user)

        await emailAdapter.sendEmail(user.accountData.email,"resent registration code",url+`?${code}=youtcodehere`)
        return
    }

}