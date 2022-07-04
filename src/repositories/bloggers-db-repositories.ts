import {bloggerCollection, BloggerType} from "./db";
import {ObjectId, WithId} from "mongodb";
const projectionBlogger={
    _id: 0,
    id: "$_id",
    name: "$name",
    youtubeUrl: "$youtubeUrl"
}

export const bloggersRepositories = {
    async paginationFilter(name: string | null) {
        let filter = {}
        if (name) {
            return filter = {name: {$regex: name}}
        }
        return filter
    },
    async blooggersSeachCount(name: string|null): Promise<number> {
        const filter = await this.paginationFilter(name)
        return await bloggerCollection.countDocuments(filter)

    },

    async getBloggersSearchTerm(size: number, number: number, name: string|null) {
        const filter = await this.paginationFilter(name)
        const bloggers = await bloggerCollection.find(filter)
            .skip((number - 1) * size)
            .limit(size)
            .project(projectionBlogger)
            .toArray()
        return bloggers
    },


    async findBloggersById(id: string): Promise<BloggerType | null> {

        const blogger = await bloggerCollection.findOne({_id: new ObjectId(id)},
            {
                projection:projectionBlogger
            })


        if (blogger) {
            // @ts-ignore
            return blogger;
        }
        return null;


    },


    async createBlogger(newBlogger: BloggerType): Promise<BloggerType> {

        // @ts-ignore
        const result = await bloggerCollection.insertOne(newBlogger)
        // @ts-ignore
        return result

    },
    async updateBloggers(blogger: BloggerType): Promise<boolean> {

        const result = await bloggerCollection.updateOne({_id: new ObjectId(blogger.id)}, {
            $set: {
                name: blogger.name,
                youtubeUrl: blogger.youtubeUrl
            }
        })


        return result.matchedCount === 1

    },
    async deleteBloggers(id: string): Promise<boolean> {

        const result = await bloggerCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },


}
