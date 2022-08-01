import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export const likeStatusValidation = body('likeStatus')
    .isString().withMessage("Should be String")

export const inputValidationLikeStatus = (req: Request, res: Response, next: NextFunction) => {
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

export const likeOrDislakeValidation = (req: Request, res: Response, next: NextFunction) => {
    const likeStatus = req.body.likeStatus
    console.log(likeStatus)
    console.log("Dislike")
    if (likeStatus !== "Dislike" && likeStatus !== "Like") {
        res.status(400).json({errorsMessages: [{message: "Should be Like or Dislike", field: "likeStatus"}]})
        return
    }
    next()


}