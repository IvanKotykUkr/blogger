import {injectable} from "inversify";

@injectable()
export class PairQuizGameService {

}


const user =
    {
        "id": "string",
        "firstPlayer": {
            "answers": [
                {
                    "questionId": "string",
                    "answerStatus": "Correct",
                    "addedAt": "2022-08-11T20:33:52.043Z"
                }
            ],
            "user": {
                "id": "string",
                "login": "string"
            },
            "score": 0
        },
        "secondPlayer": {
            "answers": [
                {
                    "questionId": "string",
                    "answerStatus": "Correct",
                    "addedAt": "2022-08-11T20:33:52.043Z"
                }
            ],
            "user": {
                "id": "string",
                "login": "string"
            },
            "score": 0
        },
        "questions": [
            {
                "id": "string",
                "body": "string"
            }
        ],
        "status": "PendingSecondPlayer",
        "pairCreatedDate": "2022-08-11T20:33:52.044Z",
        "startGameDate": "2022-08-11T20:33:52.044Z",
        "finishGameDate": "2022-08-11T20:33:52.044Z"
    }