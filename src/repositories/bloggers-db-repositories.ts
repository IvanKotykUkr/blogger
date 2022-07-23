import {BloggersModelClass} from "./db";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {BloggerDBType, BloggerResponseType, BloggerType} from "../types/blogger-type";

const projectionBlogger = {
    _id: 0,
    id: "$_id",
    name: "$name",
    youtubeUrl: "$youtubeUrl",
}
const reqBlogger = (bloger:BloggerType) => {
    return {id: bloger._id, name: bloger.name, youtubeUrl: bloger.youtubeUrl}

}
export const bloggersRepositories = {
    async paginationFilter(name: string | null) {
        let filter = {}

        if (name) {
            return filter = {name: {$regex: name}}
        }
        return filter
    },
    async blooggersSeachCount(name: string | null): Promise<number> {
        const filter = await this.paginationFilter(name)
        return BloggersModelClass.countDocuments(filter)

    },

    async getBloggersSearchTerm(size: number, number: number, name: string | null): Promise<BloggerResponseType[]> {
        const filter = await this.paginationFilter(name)

        const bloggers = await BloggersModelClass.find(filter)
            .skip((number - 1) * size)
            .limit(size)
            .lean()


        return bloggers.map(d => ({id: d._id, name: d.name, youtubeUrl: d.youtubeUrl}))
    },


    async findBloggersById(id: ObjectId): Promise<BloggerResponseType | null> {
        const blogger = await BloggersModelClass.findById(id);

        if (blogger) {

            return reqBlogger(blogger)
        }
        return null;
    },


    async createBlogger(newBlogger: BloggerType): Promise<BloggerResponseType> {
        const bloggerInstance = new BloggersModelClass()
        bloggerInstance._id = new ObjectId()
        bloggerInstance.name = newBlogger.name
        bloggerInstance.youtubeUrl = newBlogger.youtubeUrl
        await bloggerInstance.save()

        //sconst result = await BloggerModelClass.create(newBlogger)

        return reqBlogger(bloggerInstance)
    },
    async updateBloggers(blogger: BloggerType): Promise<boolean> {
        const bloggerInstance = await BloggersModelClass.findById(blogger._id)
        if (!bloggerInstance) return false

        bloggerInstance.name = blogger.name
        bloggerInstance.youtubeUrl = blogger.youtubeUrl
        await bloggerInstance.save()




        return true

    },
    async deleteBloggers(id: string): Promise<boolean> {
        const bloggerInstance = await BloggersModelClass.findById(id)
        if (!bloggerInstance) return false

        await bloggerInstance.deleteOne()


        return true
    },


}