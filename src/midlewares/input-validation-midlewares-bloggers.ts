import {body, validationResult} from "express-validator";
import {NextFunction,Request,Response} from "express";





export const nameValidation = body('name').trim(undefined).isString().isLength({min:2,max:15});
export const youtubeUrlValidation = body('youtubeUrl').isString().isLength({max:100}).isURL()//.matches('^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n');
export const inputValidationBlogger = (req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
   res.status(400).json({ errors: errors.array() });
    }else {
        next()
    }
}