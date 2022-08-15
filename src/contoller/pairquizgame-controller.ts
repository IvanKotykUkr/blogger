import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {PairQuizGameService} from "../domain/pairquizgame-service";
import {ObjectId} from "mongodb";

@injectable()
export class PairQuizGameController {

    constructor(@inject(PairQuizGameService) protected pairQuizGameService: PairQuizGameService) {

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
        const sendAnswer = await this.pairQuizGameService.sendAnswer(new ObjectId(req.user.id), new ObjectId(req.params.id), req.body.answer)

    }

    async getUserTop(req: Request, res: Response) {

    }

}