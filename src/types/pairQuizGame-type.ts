import {ObjectId, WithId} from "mongodb";
import {UserRoutType} from "./user-type";
import {NewPaginationType} from "./posts-type";

export type GameType = WithId<{

    firstPlayer: GamePlayerType,
    secondPlayer: GamePlayerType | null
    questions: QuestionsType[],
    status: "PendingSecondPlayer" | "Active" | "Finished"
    pairCreatedDate: Date,
    startGameDate: Date | null,
    finishGameDate: Date | null,
}>

export type GamePlayerType = {
    answers: AnswersType[],
    user: GameUserType,
    score: number
}
export type AnswersType = {
    answer: AnswerType
} | []
export type QuestionsType = {
    id: string
    body: string
    correctAnswer?: string,
}
type QuestionsForResponseType = {
    id: string
    body: string

}
export type PlayerType = {

    user: {
        _id: ObjectId
        login: string
    }
    score: number
}
export type QuestionsForStartGameType = {
    id: string,
    body: string,
    correctAnswer: string,

}
export  type GameUserType = {
    _id: ObjectId,
    login: string
}

export type FindPlayerDbType = {
    gameId: ObjectId,
    questions: QuestionsType
}
export type AnswerType = {
    questionId: string,
    answerStatus: "Correct" | "Incorrect",
    addedAt: Date
}
export type ResponseScoreType = {
    user: UserRoutType,
    score: number

}
export type TotalGameScoreWithUser = {
    firstPlayer: ResponseScoreType,
    secondPlayer: ResponseScoreType
}
export type TopRatingType = {
    user: UserRoutType,
    sumScore: number,
    avgScores: number,
    gamesCount: number,
    winsCount: number,
    lossesCount: number,
}
export type winnerOrLoserType = {
    user: UserRoutType,
    score: number
}
export type GamePlayerResponseType = {
    answers: AnswersType[] | null,
    user: UserRoutType,
    score: number

}
export type GameResponseType = {
    id: ObjectId,
    firstPlayer: GamePlayerResponseType,
    secondPlayer: GamePlayerResponseType | null,
    questions: QuestionsForResponseType[]
    status: "PendingSecondPlayer" | "Active" | "Finished"
    pairCreatedDate: Date,
    startGameDate: Date | null,
    finishGameDate: Date | null,


}
export type RatingPaginationType = NewPaginationType<TopRatingType>
export type GameWithPagination = NewPaginationType<GamePlayerResponseType>
