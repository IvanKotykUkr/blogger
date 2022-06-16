import {Request, Response, Router} from "express";
import {bloggersRepositories} from "../repositories/bloggers-repositories";
import {
    inputValidationBlogger,
    nameValidation,
    youtubeUrlValidation
} from "../midlewares/input-validation-midlewares-bloggers";
import {basicAuthorization} from "../midlewares/basicAuth";

export const bloggersRouter = Router({})







bloggersRouter.get("/:id", async (req:Request, res:Response) => {
    let blogger = await bloggersRepositories.findBloggersById(+req.params.id)
    if(!blogger){
        res.sendStatus(404)
    }else {

        res.send(blogger)
    }



});

bloggersRouter.get("/",async (req:Request, res:Response)=> {
    const bllogers = await bloggersRepositories.getBloggers()
    res.status(200).send(bllogers)
});
bloggersRouter.post("/",
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    basicAuthorization,
   async (req:Request, res:Response) => {
 const newBlogger = await  bloggersRepositories.createBlogger(req.body.name, req.body.youtubeUrl)

        res.status(201).json(newBlogger)
});

bloggersRouter.put("/:id",
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    basicAuthorization,
    async (req:Request, res:Response) => {
    const isUpdated = await bloggersRepositories.updateBloggers(+req.params.id,req.body.name,req.body.youtubeUrl)
    if(isUpdated){

        res.status(204).json(isUpdated)

    }else {

        res.sendStatus(404)
    }

});
bloggersRouter.delete("/:id",basicAuthorization, async (req:Request, res:Response) => {
    const isDeleted  = await bloggersRepositories.deleteBloggers(+req.params.id)

    if ( isDeleted){
        res.sendStatus(204)
    }else {

        res.sendStatus(404)

    }

});



