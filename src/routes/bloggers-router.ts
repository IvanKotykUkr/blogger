import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {
    inputValidationBlogger,
    nameValidation,
    youtubeUrlValidation,
} from "../middlewares/input-validation-midlewares-bloggers";
import {basicAuthorization} from "../middlewares/basicAuth";
import {
    contentValidation, inputValidationPost,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/input-validation-midlewares-posts";

import {BloggerResponseType, BloggerResponseTypeWithPagination} from "../types/blogger-type";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";


export const bloggersRouter = Router({})

class BloggersController {
    async getBlogger(req: Request, res: Response) {
        let blogger: BloggerResponseType | null = await bloggersService.findBloggersById(req.params.id)
        if (!blogger) {
            res.sendStatus(404)
            return
        }
        res.status(200).json(blogger)
    }

    async getBloggers(req: Request, res: Response) {
        const searchnameterm = req.query.SearchNameTerm?.toString() || null;
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        const bloggers: BloggerResponseTypeWithPagination = await bloggersService.getBloggers(searchnameterm, +pagesize, +pagenumber)
        res.status(200).json(bloggers)
    }

    async createBlogger(req: Request, res: Response) {
        const newBlogger: BloggerResponseType = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).json(newBlogger)
    }

    async updateBlogger(req: Request, res: Response) {
        const isUpdated: boolean = await bloggersService.updateBloggers(req.params.id, req.body.name, req.body.youtubeUrl)
        if (isUpdated) {
            res.status(204).json(isUpdated)
            return
        }
        res.sendStatus(404)


    }

    async deleteBlogger(req: Request, res: Response) {
        const isDeleted: boolean = await bloggersService.deleteBloggers(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(404)


    }

    async getPostByBlogger(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        let bloggerPosts: PostsResponseTypeWithPagination | null = await bloggersService.getPostsByIdBlogger(req.params.id, +pagenumber, +pagesize)
        if (bloggerPosts) {
            res.send(bloggerPosts)
            return
        }
        res.sendStatus(404)


    }

    async createPostByBloger(req: Request, res: Response) {
        let newPosts: PostsResponseType | null = await bloggersService.createPostByBloggerId
        (req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content)
        if (newPosts) {
            res.status(201).json(newPosts)
            return

        }
        res.sendStatus(404)

    }
}

const bloggersController = new BloggersController()

bloggersRouter.get("/:id",
    bloggersController.getBlogger);

bloggersRouter.get("/",
    bloggersController.getBloggers);
bloggersRouter.post("/",
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    bloggersController.createBlogger);

bloggersRouter.put("/:id",
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    bloggersController.updateBlogger);
bloggersRouter.delete("/:id", basicAuthorization,
    bloggersController.deleteBlogger);
bloggersRouter.get('/:id/posts',
    bloggersController.getPostByBlogger);
bloggersRouter.post('/:id/posts',
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationPost,
    bloggersController.createPostByBloger);
