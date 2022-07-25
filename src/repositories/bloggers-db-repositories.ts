import {BloggersModelClass} from "./db";
import { ObjectId, WithId} from "mongodb";
import {BloggerDBType, BloggerResponseType, BloggerType} from "../types/blogger-type";
export class BloggersRepositories{
    reqBlogger (blogger: BloggerType){
        return {id: blogger._id, name: blogger.name, youtubeUrl: blogger.youtubeUrl}

    }
    async paginationFilter(name: string | null) {
        let filter = {}

        if (name) {
            return filter = {name: {$regex: name}}
        }
        return filter
    }
    async blooggersSeachCount(name: string | null): Promise<number> {
        const filter = await this.paginationFilter(name)
        return BloggersModelClass.countDocuments(filter)

    }
    async getBloggersSearchTerm(size: number, number: number, name: string | null): Promise<BloggerResponseType[]> {
        const filter = await this.paginationFilter(name)

        const bloggers = await BloggersModelClass.find(filter)
            .skip((number - 1) * size)
            .limit(size)
            .lean()


        return bloggers.map(d => ({id: d._id, name: d.name, youtubeUrl: d.youtubeUrl}))
    }
    async findBloggersById(id: ObjectId): Promise<BloggerResponseType | null> {
        const blogger = await BloggersModelClass.findById(id);

        if (blogger) {

            return this.reqBlogger(blogger)
        }
        return null;
    }
    async createBlogger(newBlogger: BloggerDBType): Promise<BloggerResponseType> {
        const bloggerInstance = new BloggersModelClass()
        bloggerInstance._id =newBlogger._id
        bloggerInstance.name = newBlogger.name
        bloggerInstance.youtubeUrl = newBlogger.youtubeUrl
        await bloggerInstance.save()


        return this.reqBlogger(bloggerInstance)
    }
    async updateBloggers(blogger: BloggerType): Promise<boolean> {
        const bloggerInstance = await BloggersModelClass.findById(blogger._id)
        if (!bloggerInstance) return false
        /*  const old=bloggerInstance.name
          const old2=bloggerInstance.youtubeUrl
          const history=new BloggersModelClass({isHistory:true,srcId:bloggerInstance._id,changer:'Ivan',old,old2})

          await history.save()


         */
        bloggerInstance.name = blogger.name
        bloggerInstance.youtubeUrl = blogger.youtubeUrl
        await bloggerInstance.save()
        return true

    }
    async deleteBloggers(id: string): Promise<boolean> {
        const bloggerInstance = await BloggersModelClass.findById(id)
        if (!bloggerInstance) return false

        await bloggerInstance.deleteOne()


        return true
    }

}

