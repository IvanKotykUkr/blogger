import {Request, Response, Router} from "express";
import nodemailer from "nodemailer";

import {jwtService} from "../aplication/jwt-service";
import {

    inputValidationAuth,
    loginValidation,
    passwordValidation
} from "../midlewares/input-validation-auth";
import {UserType} from "../types/user-type";
import {authService} from "../domain/auth-service";

export const authRouter = Router({})


authRouter.post('/login',
    loginValidation,
    passwordValidation,
    inputValidationAuth,
    async (req: Request, res: Response) => {
        const user: UserType | boolean = await authService.checkCredentials(req.body.login, req.body.password)

        if (user) {
            const token = await jwtService.createJWT(<UserType>user)
            res.status(200).send(token)
            return
        }
        res.sendStatus(401)


    });
authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {


});
authRouter.post('/send', async (req: Request, res: Response) => {
    const nodemailer = require("nodemailer");

    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: "", // generated ethereal user
            pass: "", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transport .sendMail({
        from: '"Kotyk" <backendkotyk@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: req.body.subject, // Subject line
        html: "<b>Hello world?</b>", // html body
    });
    console.log(info)

    res.send({
        "email": req.body.email,
        "message":req.body.message,
        "subject":req.body.subject

    } )

});

authRouter.post('/registration', async (req: Request, res: Response) => {
    const user = await authService.createUser(req.body.login, req.body.email, req.body.password)



    res.sendStatus(204)
});
authRouter.post('/registration-confirmation-email-resending', async (req: Request, res: Response) => {

});
