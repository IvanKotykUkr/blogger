import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import "reflect-metadata";
@injectable()
export class UsersController {


    constructor(@inject(UsersService)protected usersService: UsersService,@inject(AuthService) protected authService: AuthService) {

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