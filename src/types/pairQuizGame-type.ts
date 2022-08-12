import {ObjectId, WithId} from "mongodb";

export type GameType = WithId<{
    firstPlayer: GamePlayerType,
    secondPlayer: GamePlayerType | null
    questions: questionsType[],
    status: "PendingSecondPlayer" | "Active" | "Finished"
    pairCreatedDate: Date,
    startGameDate: Date,
    finishGameDate: Date,
}>

export type GamePlayerType = {
    answers: AnswersType[]
    user: {
        id: ObjectId,
        login: string
    },
    score: number
}
export type AnswersType = {
    questionId: string,
    answerStatus: "Correct" | "Incorrect",
    addedAt: Date
}
export type questionsType = WithId<{
    body: string
}>

