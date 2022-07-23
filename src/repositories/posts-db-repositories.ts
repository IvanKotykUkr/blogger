import {PostsModelClass} from "./db";
import {ObjectId} from "mongodb";
import {PostsResponseType, PostsType} from "../types/posts-type";

const projectionPost = {
    _id: 0,
    id: "$_id",
    title: "$title",
    shortDescription: "$shortDescription",
    content: "$content",
    bloggerId: "$bloggerId",
    bloggerName: "$bloggerName",

}

export const postsRepositories = {
    async paginationFilter(bloggerId: undefined | string | ObjectId) {
        let filter = {}
        if (bloggerId) {
            return filter = {bloggerId: new ObjectId(bloggerId)}
        }
        return filter
    },
    async findPostsByIdBloggerCount(bloggerId: undefined | string | ObjectId): Promise<number> {
        const filter = await this.paginationFilter(bloggerId)
        return PostsModelClass.countDocuments(filter)
    },
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

    },

    async findPostsById(postid: ObjectId): Promise<PostsResponseType | null> {


        const post = await PostsModelClass.findOne(
            {_id: new ObjectId(postid)})

        if (post) {


            return {
                id: post._id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
                bloggerName: post.bloggerName
            }
        }
        return null;

    },
    async createPost(newpost: PostsType): Promise<PostsResponseType> {


        const postsInstance = new PostsModelClass
        postsInstance._id = new ObjectId(),
            postsInstance.title = newpost.title
        postsInstance.shortDescription = newpost.shortDescription
        postsInstance.content = newpost.content
        postsInstance.bloggerId = newpost.bloggerId
        postsInstance.bloggerName = newpost.bloggerName
        await postsInstance.save()
        return {
            id: postsInstance._id,
            title: postsInstance.title,
            shortDescription: postsInstance.shortDescription,
            content: postsInstance.content,
            bloggerId: postsInstance.bloggerId,
            bloggerName: postsInstance.bloggerName
        }


    },
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
    },


    async deletePost(_id: ObjectId): Promise<boolean> {
        const postsInstance = await PostsModelClass.findById(_id)
        if (!postsInstance) return false
        await postsInstance.deleteOne()
        return true

    },


}