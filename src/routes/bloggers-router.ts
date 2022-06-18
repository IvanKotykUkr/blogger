import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {

    inputValidationBlogger,
    nameValidation,
    youtubeUrlValidation,

} from "../midlewares/input-validation-midlewares-bloggers";
import {basicAuthorization} from "../midlewares/basicAuth";

export const bloggersRouter = Router({})







bloggersRouter.get("/:id", async (req:Request, res:Response) => {
    let blogger = await bloggersService.findBloggersById(+req.params.id)
    if(!blogger){
        res.sendStatus(404)
    }else {

        res.send(blogger)
    }



});

bloggersRouter.get("/" ,async (req:Request, res:Response)=> {
    const bllogers = await bloggersService.getBloggers()

    res.status(200).send(bllogers)


});
bloggersRouter.post("/",
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,

async (req:Request, res:Response) => {
 const newBlogger = await  bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)

        res.status(201).json(newBlogger)
});

bloggersRouter.put("/:id",
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,


    async (req:Request, res:Response) => {
    const isUpdated = await bloggersService.updateBloggers(+req.params.id,req.body.name,req.body.youtubeUrl)
    if(isUpdated){

        res.status(204).json(isUpdated)

    }else {

        res.sendStatus(404)
    }

});
bloggersRouter.delete("/:id",basicAuthorization, async (req:Request, res:Response) => {
    const isDeleted  = await bloggersService.deleteBloggers(+req.params.id)

    if ( isDeleted){
        res.sendStatus(204)
    }else {

        res.sendStatus(404)

    }

});



