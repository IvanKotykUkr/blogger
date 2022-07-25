import {PostsModelClass} from "./db";
import {ObjectId} from "mongodb";
import {PostsDBType, PostsResponseType, PostsType} from "../types/posts-type";

export class PostsRepositories {
    resPost(post: PostsType) {
        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName
        }

    }

    async paginationFilter(bloggerId: undefined | string | ObjectId) {
        let filter = {}
        if (bloggerId) {
            return filter = {bloggerId: new ObjectId(bloggerId)}
        }
        return filter
    }

    async findPostsByIdBloggerCount(bloggerId: undefined | string | ObjectId): Promise<number> {
        const filter = await this.paginationFilter(bloggerId)
        return PostsModelClass.countDocuments(filter)
    }

    async findPostsByIdBloggerPagination(bloggerId: undefined | string | ObjectId, number: number, size: number): Promise<PostsResponseType[]> {
        const filter = await this.paginationFilter(bloggerId)

        const posts = await PostsModelClass.find(filter)
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .lean()

        return posts.map(p => ({
            id: p._id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            bloggerId: p.bloggerId,
            bloggerName: p.bloggerName
        }))

    }

    async findPostsById(_id: ObjectId): Promise<PostsResponseType | null> {


        const post = await PostsModelClass.findOne(
            _id)

        if (post) {


            return this.resPost(post)
        }
        return null;

    }

    async createPost(newpost: PostsDBType): Promise<PostsResponseType> {


        const postsInstance = new PostsModelClass
        postsInstance._id = newpost._id,
            postsInstance.title = newpost.title
        postsInstance.shortDescription = newpost.shortDescription
        postsInstance.content = newpost.content
        postsInstance.bloggerId = newpost.bloggerId
        postsInstance.bloggerName = newpost.bloggerName
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

