import {body, validationResult} from "express-validator";
import {NextFunction,Request,Response} from "express";


export const loginValidation = body('login')
    .isString().withMessage("Should be String")
    .isLength({min:3,max:10}).withMessage("Should be a length between 3 and 10")
export const passwordValidation = body("password")
    .isString().withMessage("Should be String")
    .isLength({min:6,max:20}).withMessage("Should be a length between 6 and 20")

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