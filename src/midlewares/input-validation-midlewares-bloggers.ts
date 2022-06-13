import {body, validationResult} from "express-validator";
import {NextFunction,Request,Response} from "express";





export const nameValidation = body('name').trim(undefined).isString().isLength({min:2,max:15});
export const youtubeUrlValidation = body('youtubeUrl').isString().isLength({max:100}).isURL()
export const inputValidationBlogger = (req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
   res.status(400).json({ errorssMessages: errors.array().map(er =>{
       return{'message':er.msg, 'field':er.param}
       }) });
    }else {
        next()
    }
}