import {inject, injectable} from "inversify";
import {ScoreGameRepositories} from "../../repositories/score-game-repositories";
import {RatingPaginationType, TopRatingType} from "../../types/pairQuizGame-type";

@injectable()
export class TopRatedHelper {
    constructor(@inject(ScoreGameRepositories) protected scoreGameRepositories: ScoreGameRepositories) {
    }

    async TopRatedWithPagination(pagenumber: number, pagesize: number): Promise<RatingPaginationType> {
        let totalCount: number = await this.scoreGameRepositories.countPlayer()
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        let items: TopRatingType[] = await this.scoreGameRepositories.getAllPlayers(page, pageSize)
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }

    }
}