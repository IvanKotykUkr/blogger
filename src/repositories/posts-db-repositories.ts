import {PostsModelClass} from "./db";
import {ObjectId} from "mongodb";
import {PostsDBType, PostsType} from "../types/posts-type";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class PostsRepositories {
    resPost(post: PostsDBType): PostsType {

        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName,
            addedAt: post.addedAt,

        }
    }

    async paginationFilter(bloggerId: undefined | string | ObjectId) {
        let filter = {}
        if (bloggerId) {
            return {bloggerId: new ObjectId(bloggerId)}
        }
        return filter
    }

    async findPostsByIdBloggerCount(bloggerId: undefined | string | ObjectId): Promise<number> {
        const filter = await this.paginationFilter(bloggerId)

        return PostsModelClass.countDocuments(filter)
    }

    async findPostsByIdBloggerPagination(bloggerId: undefined | string | ObjectId, number: number, size: number): Promise<PostsDBType[]> {
        const filter = await this.paginationFilter(bloggerId)

        return PostsModelClass.find(filter)
            .skip((number - 1) * size)
            // .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .lean()

    }

    async findPostsById(_id: ObjectId): Promise<PostsType | null> {


        const post = await PostsModelClass.findById(_id)

        if (post) {


            return this.resPost(post)
        }
        return null;

    }

    async createPost(newPost: PostsDBType): Promise<PostsType> {

        const postsInstance = new PostsModelClass
        postsInstance._id = newPost._id,
            postsInstance.title = newPost.title
        postsInstance.shortDescription = newPost.shortDescription
        postsInstance.content = newPost.content
        postsInstance.bloggerId = newPost.bloggerId
        postsInstance.bloggerName = newPost.bloggerName
        postsInstance.addedAt = new Date()
        await postsInstance.save()
        return this.resPost(postsInstance)


    }

    async updatePost(_id: ObjectId, title: string, shortDescription: string, content: string, bloggerId: ObjectId, bloggerName: string): Promise<boolean> {
        const postsInstance = await PostsModelClass.findById(_id)

        if (!postsInstance) return false

        postsInstance.title = title
        postsInstance.shortDescription = shortDescription
        postsInstance.content = content
        postsInstance.bloggerId = bloggerId
        postsInstance.bloggerName = bloggerName
        await postsInstance.save()
        return true
    }


    async deletePost(_id: ObjectId): Promise<boolean> {
        const postsInstance = await PostsModelClass.findById(_id)
        if (!postsInstance) return false
        await postsInstance.deleteOne()
        return true

    }
}

