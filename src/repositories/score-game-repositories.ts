import {injectable} from "inversify";
import {TopRatingType, winnerAndLoserType} from "../types/pairQuizGame-type";
import {TopRatedPlayerModel} from "./db";

@injectable()
export class ScoreGameRepositories {

    async addWinnerAndLoser(winnerAndLoser: winnerAndLoserType) {
        const winner = await TopRatedPlayerModel.findOne({"user.id": winnerAndLoser.winner.user.id})
        const loser = await TopRatedPlayerModel.findOne({"user.id": winnerAndLoser.loser.user.id})
        const winnerScore: number = winnerAndLoser.winner.score
        const loserScore: number = winnerAndLoser.loser.score


        if (winner) {
            winner.allScore = winner.allScore + winnerScore
            winner.sumScore = winner.sumScore + winnerScore
            winner.winsCount = winner.winsCount++
            winner.gamesCount = winner.gamesCount++
            winner.avgScores = winner.allScore / winner.gamesCount
            await winner.save()
        }
        await TopRatedPlayerModel.insertMany({
            user: winnerAndLoser.winner.user,
            allScore: winnerScore,
            sumScore: winnerScore,
            avgScores: winnerScore,
            gamesCount: 1,
            winsCount: 1,
            lossesCount: 0

        })
        if (loser) {
            loser.allScore = loser!.allScore + loserScore
            loser.sumScore = loser.sumScore + 0
            loser.lossesCount = loser.lossesCount++
            loser.gamesCount = loser.gamesCount++
            loser.avgScores = loser.allScore / loser.gamesCount
            await loser.save()

        }
        await TopRatedPlayerModel.insertMany({
            user: winnerAndLoser.loser.user,
            allScore: loserScore,
            sumScore: 0,
            avgScores: loserScore,
            gamesCount: 1,
            winsCount: 0,
            lossesCount: 1

        })
        return true
    }

    async countPlayer(): Promise<number> {
        return TopRatedPlayerModel.countDocuments()
    }

    async getAllPlayers(number: number, size: number): Promise<TopRatingType[]> {
        return TopRatedPlayerModel.find({}, {allScore: 0})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)

            .lean()

    }
}