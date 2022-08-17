import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {PairQuizGameService} from "../domain/pairquizgame-service";
import {ObjectId} from "mongodb";
import {TopRatedHelper} from "../domain/helpers/toprated-helper";

@injectable()
export class PairQuizGameController {

    constructor(@inject(PairQuizGameService) protected pairQuizGameService: PairQuizGameService,
                @inject(TopRatedHelper) protected topRatedHelper: TopRatedHelper) {

    }

    async myCurrent(req: Request, res: Response) {
        //   const currentGame = await this.pairQuizGameService.myCurrentGame(new ObjectId(req.user.id),)
    }

    async getGameById(req: Request, res: Response) {

    }

    async getAllGame(req: Request, res: Response) {

    }

    async connectUser(req: Request, res: Response) {
        const connectedUser = await this.pairQuizGameService.connectGame(new ObjectId(req.user.id), req.user.login)
        res.status(200).send(connectedUser)
    }

    async sendAnswer(req: Request, res: Response) {
        const sendAnswer = await this.pairQuizGameService.sendAnswer(new ObjectId(req.user.id), req.body.answer)
        if (sendAnswer) {
            res.status(200).send(sendAnswer)
            return
        }
        res.status(403).json({
            errorsMessages: [{
                message: "current user is not inside active pair or user is in active pair but has already answered to all questions",
                field: "User"
            }]
        })
    }

    async getUserTop(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        const rating = await this.topRatedHelper.TopRatedWithPagination(+pagenumber, +pagesize)
        res.status(200).send(rating)
    }

}