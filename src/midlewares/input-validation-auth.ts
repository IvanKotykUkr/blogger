import {body, validationResult} from "express-validator";
import {NextFunction,Request,Response} from "express";


export const loginValidation = body('login')
    .isString().withMessage("Should be String")

export const passwordValidation = body("password")
    .isString().withMessage("Should be String")


export const inputValidationAuth = (req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newError = errors.array()
        res.status(400).json({
            errorsMessages: newError.map(er =>({
                message: er.msg,
                field: er.param
            }))});
    }else {
        next()
    }



}