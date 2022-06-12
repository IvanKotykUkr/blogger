import {Request, Response, Router} from "express";
import {bloggersRepositories} from "../repositories/bloggers-repositories";
import {
    inputValidationBlogger,
    nameValidation,
    youtubeUrlValidation
} from "../midlewares/input-validation-midlewares-bloggers";

export const bloggersRouter = Router({})







bloggersRouter.get("/:id", (req:Request, res:Response) => {
    let blogger = bloggersRepositories.findBloggersById(+req.params.id)
    if(!blogger){
        res.sendStatus(404)
    }else {

        res.send(blogger)
    }



});

bloggersRouter.get("/",(req:Request, res:Response)=> {
    const bllogers = bloggersRepositories.allBloggers
    res.send(bllogers)
});
bloggersRouter.post("/",
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    (req:Request, res:Response) => {
 const newBlogger =   bloggersRepositories.createBlogger(req.body.name, req.body.youtubeUrl)

    res.send(newBlogger)
});

bloggersRouter.put("/:id", nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,(req:Request, res:Response) => {
    const isUpdated = bloggersRepositories.updateBloggers(+req.params.id,req.body.name,req.body.youtubeUrl)
    if(isUpdated){

        res.send(isUpdated).sendStatus(204)
    }else {

        res.sendStatus(404)
    }

});
bloggersRouter.delete("/:id", (req:Request, res:Response) => {
    const isDeleted  = bloggersRepositories.deleteBloggers(+req.params.id)

    if ( isDeleted){
        res.sendStatus(204)
    }else {


        res.sendStatus(404)
    }

});



