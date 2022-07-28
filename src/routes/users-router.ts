import {Request, Response, Router} from "express";
import {UsersService} from "../domain/users-service";
import {basicAuthorization} from "../middlewares/basicAuth";
import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../middlewares/input-validation-users";
import {UserRoutType} from "../types/user-type";
import {AuthService} from "../domain/auth-service";
import {emailValidation, inputValidationAuth} from "../middlewares/input-validation-auth";
import {registrationMiddlewares} from "../middlewares/auth-validation-middleware";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";

export const usersRouter = Router({})

class UsersController {
    usersService: UsersService
    authService: AuthService

    constructor() {
        this.authService = new AuthService()
        this.usersService = new UsersService()
    }

    async getUsers(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        const users = await this.usersService.getAllUsers(+pagenumber, +pagesize)
        res.status(200).send(users)

    }

    async createUser(req: Request, res: Response) {
        const proces = "create"
        const newUser = await this.authService.createUser(req.body.login, req.body.email, req.body.password, proces)
        if (newUser === null) {
            res.sendStatus(400)
            return
        }
        res.status(201).send(newUser)
    }

    async deleteUser(req: Request, res: Response) {
        const isDeleted: boolean = await this.usersService.deleteUser(req.params.id);
        if (isDeleted) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(404)


    }
}

const usersController = new UsersController()
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

