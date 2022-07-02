import {postsCollection, PostType} from "./db";
import {InsertOneResult} from "mongodb";


export const postsRepositories = {
    async getPostsCount(): Promise<number> {
        return postsCollection.countDocuments()
    },
    async getPostsPagination(number: number, size: number) {
        return postsCollection.find({})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size).project({_id: 0})
            .toArray()
    },

    async findPostsById(postid: string): Promise<PostType | null> {

        // @ts-ignore
        const post: PostType = await postsCollection.findOne({id: postid}, {projection: {_id: 0}})

        if (post) {
            return post;
        }
        return null;

    },
    async createPost(newpost: PostType): Promise<InsertOneResult<PostType>> {


        const result: InsertOneResult<PostType> = await postsCollection.insertOne(newpost)
        return result
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id},
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
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1


    },
    async findPostsByIdBloggerCount(bloggerId: string): Promise<number> {
        const posts: number = await postsCollection.countDocuments({bloggerId: bloggerId})
        return posts
    },
    async findPostsByIdBloggerPagination(bloggerId: string, number: number, size: number) {
        const posts = postsCollection.find({bloggerId: bloggerId})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .project({_id: 0})
            .toArray()
        return posts

    }

}