import "reflect-metadata";
import {injectable} from "inversify";
import {TopRatingType, winnerOrLoserType} from "../types/pairQuizGame-type";
import {TopRatedPlayerModel} from "./db";

@injectable()
export class ScoreGameRepositories {
    async countPlayer(): Promise<number> {
        return TopRatedPlayerModel.countDocuments()
    }

    async getAllPlayers(number: number, size: number): Promise<TopRatingType[]> {
        return TopRatedPlayerModel.find({}, {_id: 0})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .sort({avgScores: -1})
            .lean()

    }

    async addWinner(winner: winnerOrLoserType): Promise<TopRatingType> {
        let player = await TopRatedPlayerModel.findOne({"user.id": winner.user.id})
        const winnerScore: number = winner.score
        if (player) {
            player.sumScore = player.sumScore + winnerScore
            player.winsCount = player.winsCount + 1
            player.gamesCount = player.gamesCount + 1
            player.avgScores = player.sumScore / player.gamesCount
            await player.save()
        }
        player = await TopRatedPlayerModel.create({
            user: winner.user,
            allScore: winnerScore,
            sumScore: winnerScore,
            avgScores: winnerScore,
            gamesCount: 1,
            winsCount: 1,
            lossesCount: 0

        })

        return player

    }

    async addLoser(loser: winnerOrLoserType): Promise<TopRatingType> {
        let player = await TopRatedPlayerModel.findOne({"user.id": loser.user.id})
        const loserScore: number = loser.score

        if (player) {
            player.sumScore = player.sumScore + 0
            player.lossesCount = player.lossesCount + 1
            player.gamesCount = player.gamesCount + 1
            player.avgScores = player.sumScore / player.gamesCount
            await player.save()

        }

        player = await TopRatedPlayerModel.create({
            user: loser.user,
            allScore: loserScore,
            sumScore: 0,
            avgScores: loserScore,
            gamesCount: 1,
            winsCount: 0,
            lossesCount: 1

        })


        return player
    }
}