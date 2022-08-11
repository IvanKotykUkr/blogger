import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {PairQuizGameService} from "../domain/pairquizgame-service";
import {ObjectId} from "mongodb";

@injectable()
export class PairQuizGameController {

    constructor(@inject(PairQuizGameService) protected pairQuizGameService: PairQuizGameService) {

    }

    async myCurrent(req: Request, res: Response) {
        const currentGame = await this.pairQuizGameService.myCurrentGame(new ObjectId(req.user.id),)
    }

    async getGameById(req: Request, res: Response) {

    }

    async getAllGame(req: Request, res: Response) {

    }

    async connectUser(req: Request, res: Response) {

    }

    async sendAnswer(req: Request, res: Response) {

    }

    async getUserTop(req: Request, res: Response) {

    }

}