import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {
    inputValidationBlogger,
    nameValidation,
    youtubeUrlValidation,
} from "../midlewares/input-validation-midlewares-bloggers";
import {basicAuthorization} from "../midlewares/basicAuth";
import {
    contentValidation, inputValidationPost,
    shortDescriptionValidation,
    titleValidation
} from "../midlewares/input-validation-midlewares-posts";
import {BloggerType, PostType} from "../repositories/db";


export const bloggersRouter = Router({})


bloggersRouter.get("/:id",
    async (req: Request, res: Response) => {
        let blogger: BloggerType | null = await bloggersService.findBloggersById(req.params.id)
        if (!blogger) {
            res.sendStatus(404)
            return
        }
        res.status(200).json(blogger)

    });

bloggersRouter.get("/",
    async (req: Request, res: Response) => {
        const searchnameterm = req.query.SearchNameTerm || null;
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        // @ts-ignore
        const bloggers = await bloggersService.getBloggers(searchnameterm, +pagesize, +pagenumber)
        res.status(200).json(bloggers)
    });
bloggersRouter.post("/",
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    async (req: Request, res: Response) => {
        const newBlogger: BloggerType = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).json(newBlogger)
    });

bloggersRouter.put("/:id",
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    async (req: Request, res: Response) => {
        const isUpdated: boolean = await bloggersService.updateBloggers(req.params.id, req.body.name, req.body.youtubeUrl)
        if (isUpdated) {
            res.status(204).json(isUpdated)
            return
        }
        res.sendStatus(404)


    });
bloggersRouter.delete("/:id", basicAuthorization, async (req: Request, res: Response) => {
    const isDeleted: boolean = await bloggersService.deleteBloggers(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
        return
    }
    res.sendStatus(404)


});
bloggersRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const pagenumber = req.query.PageNumber || 1;
    const pagesize = req.query.PageSize || 10;
    let bloggerPosts: any = await bloggersService.getPostsbyIdBlogger(req.params.id, +pagenumber, +pagesize)
    if (bloggerPosts) {
        res.send(bloggerPosts)
        return
    }
    res.sendStatus(404)


});
bloggersRouter.post('/:id/posts',
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationPost,
    async (req: Request, res: Response) => {
        let newPosts: PostType | null = await bloggersService.createPostbyBloggerId
        (req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content)
        if (newPosts) {
            res.status(201).json(newPosts)
            return

        }
        res.sendStatus(404)

    });



