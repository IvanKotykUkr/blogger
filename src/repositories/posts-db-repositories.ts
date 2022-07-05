import {postsCollection} from "./db";
import {InsertOneResult, ObjectId} from "mongodb";
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
        const posts: number = await postsCollection.countDocuments(filter)
        return posts
    },
    async findPostsByIdBloggerPagination(bloggerId: undefined | string | ObjectId, number: number, size: number): Promise<PostsResponseType[]> {
        const filter = await this.paginationFilter(bloggerId)
        // @ts-ignore
        const posts: PostsResponseType[] = postsCollection.find(filter)
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .project(projectionPost)
            .toArray()

        return posts

    },

    async findPostsById(postid: string): Promise<PostsResponseType | null> {


        // @ts-ignore
        const post: PostsResponseType = await postsCollection.findOne(
            {_id: new ObjectId(postid)},
            {
                projection: projectionPost
            })

        if (post) {


            return post;
        }
        return null;

    },
    async createPost(newpost: PostsType): Promise<InsertOneResult<PostsType>> {


        const result: InsertOneResult<PostsType> = await postsCollection.insertOne(newpost)

        return result

    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string): Promise<boolean> {
        const result = await postsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    bloggerId: bloggerId,
                    bloggerName: bloggerName
                }
            })
        return result.matchedCount === 1
    },


    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1


    },


}