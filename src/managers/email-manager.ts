import {UserType} from "../types/user-type";
import {emailAdapter} from "../adapters/email-adapter";

export const emailManager={

    async message(code:string){

        return `https://some-front.com/confirm-registration?${code}=youtcodehere`
    },
    async sendEmailConfirmationMessage(email:string,code:string){
        const message=await this.message(code)

        await emailAdapter.sendEmail(email,"registration",message)
       return
    },
    async resentEmailConfirmationMessage(email:string,code:string) {

        const message=await this.message(code)

        await emailAdapter.sendEmail(email,"resent registration code",message)
        return
    }

}