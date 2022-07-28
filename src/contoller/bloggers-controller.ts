import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {BloggerResponseType, BloggerResponseTypeWithPagination} from "../types/blogger-type";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";

export class BloggersController {


    constructor(protected bloggersService: BloggersService) {

    }

    async getBlogger(req: Request, res: Response) {
        let blogger: BloggerResponseType | null = await this.bloggersService.findBloggersById(req.params.id)
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
        const bloggers: BloggerResponseTypeWithPagination = await this.bloggersService.getBloggers(searchnameterm, +pagesize, +pagenumber)
        res.status(200).json(bloggers)
    }

    async createBlogger(req: Request, res: Response) {
        const newBlogger: BloggerResponseType = await this.bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).json(newBlogger)
    }

    async updateBlogger(req: Request, res: Response) {
        const isUpdated: boolean = await this.bloggersService.updateBloggers(req.params.id, req.body.name, req.body.youtubeUrl)
        if (isUpdated) {
            res.status(204).json(isUpdated)
            return
        }
        res.sendStatus(404)


    }

    async deleteBlogger(req: Request, res: Response) {
        const isDeleted: boolean = await this.bloggersService.deleteBloggers(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(404)


    }

    async getPostByBlogger(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        let bloggerPosts: PostsResponseTypeWithPagination | null = await this.bloggersService.getPostsByIdBlogger(req.params.id, +pagenumber, +pagesize)
        if (bloggerPosts) {
            res.send(bloggerPosts)
            return
        }
        res.sendStatus(404)


    }

    async createPostByBloger(req: Request, res: Response) {
        let newPosts: PostsResponseType | null = await this.bloggersService.createPostByBloggerId
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