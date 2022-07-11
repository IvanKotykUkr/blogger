import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";


export const loginValidation = body('login',)
    .isString().withMessage("Should be String")
    .isLength({min: 2, max: 15}).withMessage("Should be a length from2 to 15")
export const passwordValidation = body("password")
    .isString().withMessage("Should be String")
export const codeValidation=body('code')
    .isUUID(4).withMessage("Should be valide code ")
export const emailValidation = body("email")
    .isEmail().withMessage("Should be valide email")
export const inputValidationAuth = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newError = errors.array()
        res.status(400).json({
            errorsMessages: newError.map(er => ({
                message: er.msg,
                field: er.param
            }))
        });
        return
    }
    next()


}