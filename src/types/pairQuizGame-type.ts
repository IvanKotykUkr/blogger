import {ObjectId, WithId} from "mongodb";

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