import {Router} from "express";
import {container} from "../composition-root";
import {PairQuizGameController} from "../contoller/pairquizgame-controller";
import {authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {participatingMiddlewares} from "../middlewares/participating-middlewares";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";

const pairQuizGameController = container.resolve(PairQuizGameController)
export const pairQuizGameRouter = Router({})
pairQuizGameRouter.get("/pairs/my", authValidationMiddleware, pairQuizGameController.getAllGame.bind(pairQuizGameController))
pairQuizGameRouter.get("/pairs/my-current", authValidationMiddleware, pairQuizGameController.myCurrent.bind(pairQuizGameController))
pairQuizGameRouter.get("/pairs/:id", idValidationMiddleware, authValidationMiddleware, pairQuizGameController.getGameById.bind(pairQuizGameController))
pairQuizGameRouter.post("/pairs/connection", authValidationMiddleware, participatingMiddlewares, pairQuizGameController.connectUser.bind(pairQuizGameController))
pairQuizGameRouter.post("/pairs/my-current/answer", authValidationMiddleware, pairQuizGameController.sendAnswer.bind(pairQuizGameController))
pairQuizGameRouter.get("/users/top", pairQuizGameController.getUserTop.bind(pairQuizGameController))