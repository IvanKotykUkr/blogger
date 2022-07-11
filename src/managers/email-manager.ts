import {UserType} from "../types/user-type";
import {emailAdapter} from "../adapters/email-adapter";

export const emailManager={

    async conFirmaTionCode(user:UserType){
        const code= await user.emailConfirmation.confirmationCode
        return `https://some-front.com/confirm-registration?${code}=youtcodehere`
    },
    async sendEmailConfirmationMessage(user:UserType){
        const code=await this.conFirmaTionCode(user)
       await emailAdapter.sendEmail(user.accountData.email,"registration",code)
       return
    },
    async resentEmailConfirmationMessage(user: UserType) {

        const code=await this.conFirmaTionCode(user)

        await emailAdapter.sendEmail(user.accountData.email,"resent registration code",code)
        return
    }

}