import {body, validationResult} from "express-validator";
import {NextFunction,Request,Response} from "express";
import {bloggersRepositories} from "../repositories/bloggers-repositories";



export const titleValidation = body('title').trim(undefined).isString().isLength({min:2,max:30});
export const shortDescriptionValidation = body('shortDescription').trim().isString().isLength({min:2,max:100});
export const contentValidation = body('content').trim(undefined).isString().isLength({min:2,max:1000});
export const bloggerIdtValidation = body('bloggerId').trim(undefined).isNumeric();
export const inputValidationPost = (req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errorssMessages: errors.array().map(er =>{
                return{'message':er.msg, 'field':er.param}
            }) });
    }else {
        next()
    }
}
