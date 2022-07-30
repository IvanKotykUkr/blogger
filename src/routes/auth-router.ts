import {Router} from "express";
import {
    codeValidation,
    emailValidation,
    inputValidationAuth,
    loginValidation,
    passwordValidation,
} from "../middlewares/input-validation-auth";

import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../middlewares/input-validation-users";
import {
    antiDosMiddlewares,
    loginAuthMiddlewares,
    registrationConfirmMiddlewares,
    registrationMiddlewares,
    registrationResendingMiddlewares
} from "../middlewares/auth-validation-middleware";
import {authRefreshTokenMiddlewares, authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {container} from "../composition-root";
import {AuthController} from "../contoller/auth-controller";
const authController=container.resolve(AuthController)


export const authRouter = Router({})


authRouter.post('/login',
    antiDosMiddlewares,
    loginValidation,
    passwordValidation,
    inputValidationAuth,
    loginAuthMiddlewares,
    authController.login.bind(authController));
authRouter.post('/refresh-token',
    authRefreshTokenMiddlewares,
    authController.refreshToken.bind(authController));
authRouter.post('/logout',

    authRefreshTokenMiddlewares,
    authController.logout.bind(authController));
authRouter.post('/registration-confirmation',
    antiDosMiddlewares,

    codeValidation,
    inputValidationAuth,
    registrationConfirmMiddlewares,
    authController.registrationConfirmation.bind(authController));

authRouter.post('/registration',
    antiDosMiddlewares,
    registrationMiddlewares,
    emailValidation,
    inputValidationAuth,
    loginValidationUser,

    passwordValidationUser,
    inputValidationUser,

    authController.registration.bind(authController));
authRouter.post('/registration-email-resending',
    antiDosMiddlewares,
    emailValidation,
    inputValidationUser,
    registrationResendingMiddlewares,
    authController.registrationEmailResending.bind(authController));
authRouter.get('/me', authValidationMiddleware, authController.me.bind(authController));