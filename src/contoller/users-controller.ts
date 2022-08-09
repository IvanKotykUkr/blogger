import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {ObjectId} from "mongodb";

@injectable()
export class UsersController {


    constructor(@inject(UsersService) protected usersService: UsersService) {

    }

    async getUsers(req: Request, res: Response) {
        const pagenumber = req.query?.PageNumber || 1;
        const pagesize = req.query?.PageSize || 10;
        const users = await this.usersService.getAllUsers(+pagenumber, +pagesize)
        res.status(200).json({users})

    }

    async createUser(req: Request, res: Response) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)

        res.status(201).json({newUser})
    }

    async deleteUser(req: Request, res: Response) {
        const isDeleted: boolean = await this.usersService.deleteUser(new ObjectId(req.params.id));
        if (isDeleted) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(404)


    }
}