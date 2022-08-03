import {NextFunction, Request, Response} from "express";

class IdValidation {
    async idMiddlewaresValidation(req: Request, res: Response, next: NextFunction) {
        const convertToHex = (id: string) => {
            return id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")
        }


        const idHex: string = convertToHex(req.params.id)
        if (idHex.length !== 48) {


            res.status(404).json({errorsMessages: [{message: "wrong id", field: "id"}]})
            return
        }
        next()
    }

}

const idValidation = new IdValidation()

export const idValidationMiddleware = idValidation.idMiddlewaresValidation.bind(idValidation);