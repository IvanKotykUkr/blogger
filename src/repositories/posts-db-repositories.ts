import {postsCollection, PostType, PostTypeInsert} from "./db";
import {InsertOneResult, ObjectId} from "mongodb";


export const postsRepositories = {
    async paginationFilter(bloggerId: string | null) {
        let filter = {}
        if (bloggerId) {
            return filter = {bloggerId: new ObjectId(bloggerId)}
        }
        return filter
    },
    async findPostsByIdBloggerCount(bloggerId: null | string): Promise<number> {
        const filter = await this.paginationFilter(bloggerId)
        const posts: number = await postsCollection.countDocuments(filter)
        return posts
    },
    async findPostsByIdBloggerPagination(bloggerId: string | null, number: number, size: number) {
        const filter = await this.paginationFilter(bloggerId)
        const posts = postsCollection.find(filter)
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .project({
                _id: 0,
                id: "$_id",
                title: "$title",
                shortDescription: "$shortDescription",
                content: "$content",
                bloggerId: "$bloggerId",
                bloggerName: "$bloggerName",
            })
            .toArray()
        return posts

    },

    async findPostsById(postid: string): Promise<PostType | null> {

        // @ts-ignore
        const post: PostType = await postsCollection.findOne(
            {_id: new ObjectId(postid)},
            {
                projection: {
                    _id: 0,
                    id: "$_id",
                    title: "$title",
                    shortDescription: "$shortDescription",
                    content: "$content",
                    bloggerId: "$bloggerId",
                    bloggerName: "$bloggerName",
                }
            })

        if (post) {
            return post;
        }
        return null;

    },
    async createPost(newpost: PostType): Promise<PostType> {


        const result = await postsCollection.insertOne(newpost)
        // @ts-ignore
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