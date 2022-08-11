import {Router} from "express";
import {container} from "../composition-root";
import {PairQuizGameController} from "../contoller/pairquizgame-controller";
import {authValidationMiddleware} from "../middlewares/auth-access-middlewares";

const pairQuizGameController = container.resolve(PairQuizGameController)
export const pairQuizGameRouter = Router({})
pairQuizGameRouter.get("/pairs/my-current", authValidationMiddleware, pairQuizGameController.myCurrent.bind(pairQuizGameController))
pairQuizGameRouter.get("/pairs/:id", authValidationMiddleware, pairQuizGameController.getGameById.bind(pairQuizGameController))
pairQuizGameRouter.get("/pairs/my", authValidationMiddleware, pairQuizGameController.getAllGame.bind(pairQuizGameController))
pairQuizGameRouter.post("/pairs/connection", authValidationMiddleware, pairQuizGameController.connectUser.bind(pairQuizGameController))
pairQuizGameRouter.post("/pairs/my-current/answer", authValidationMiddleware, pairQuizGameController.sendAnswer.bind(pairQuizGameController))
pairQuizGameRouter.get("/users/top", authValidationMiddleware, pairQuizGameController.getUserTop.bind(pairQuizGameController))