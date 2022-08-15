import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {GameRepositories} from "../repositories/game-db-repositories";

const gameRepositories = container.resolve(GameRepositories)
export const participatingMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.id

    const participating = await gameRepositories.checkParticipating(user)
    if (participating) {
        res.status(403).json({
            errorsMessages: [{
                message: "current user is already participating in active pair",
                field: "User"
            }]
        })
        return
    }


    next()

}