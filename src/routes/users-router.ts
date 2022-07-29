import {Router} from "express";
import {basicAuthorization} from "../middlewares/basicAuth";
import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../middlewares/input-validation-users";
import {emailValidation, inputValidationAuth} from "../middlewares/input-validation-auth";
import {registrationMiddlewares} from "../middlewares/auth-validation-middleware";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";
import {usersController} from "../composition-root";

export const usersRouter = Router({})


usersRouter.get('/', usersController.getUsers.bind(usersController));

usersRouter.post('/',
    basicAuthorization,
    emailValidation,
    inputValidationAuth,
    loginValidationUser,

    passwordValidationUser,
    inputValidationUser,
    registrationMiddlewares,

    usersController.createUser.bind(usersController));
usersRouter.delete('/:id',
    idValidationMiddleware,
    basicAuthorization,
    usersController.deleteUser.bind(usersController))

