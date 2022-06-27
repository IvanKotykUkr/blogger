import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {basicAuthorization} from "../midlewares/basicAuth";
import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../midlewares/input-validation-users";

export const usersRouter = Router({})
usersRouter.get('/', async (req:Request, res:Response)=>{
   const users=await usersService.getAllUsers()
   res.status(201).send(users)

});

usersRouter.post('/',
    loginValidationUser,
    passwordValidationUser,
    inputValidationUser,
    basicAuthorization,
    async (req:Request, res:Response)=>{
   const newProduct=await usersService.createUser(req.body.login,req.body.email,req.body.password)
   res.status(201).send(newProduct)
});
usersRouter.delete('/:id', basicAuthorization,async (req:Request, res:Response)=>{
   const isDeleted=await usersService.deleteUser(+req.params.id);
   if (isDeleted){
      res.sendStatus(204)
   }else {

      res.sendStatus(404)

   }
})

