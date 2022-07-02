import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {basicAuthorization} from "../midlewares/basicAuth";
import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../midlewares/input-validation-users";

export const usersRouter = Router({})
usersRouter.get('/', async (req: Request, res: Response) => {
    const pagenumber = req.query.PageNumber || 1;
    const pagesize = req.query.PageSize || 10;
    const users = await usersService.getAllUsers(+pagenumber, +pagesize)
    res.status(200).send(users)

});

usersRouter.post('/',
    basicAuthorization,
    loginValidationUser,
    passwordValidationUser,
    inputValidationUser,

    async (req: Request, res: Response) => {
        const newProduct = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.status(201).send(newProduct)
    });
usersRouter.delete('/:id', basicAuthorization, async (req: Request, res: Response) => {
    const isDeleted = await usersService.deleteUser(req.params.id);
    if (isDeleted) {
        res.sendStatus(204)
        return
    }

    res.sendStatus(404)


})

