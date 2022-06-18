
import {bloggersRepositories} from "../repositories/bloggers-db-repositories";


export const bloggersService = {
    async getBloggers(){
        return  bloggersRepositories.getBloggers()

    },

    async findBloggersById(id: number) {
        let blogger= await bloggersRepositories.findBloggersById(id)
        if(blogger) {
            return blogger;
        }else {
            return null;
        }

    },


    async createBlogger(name:string,youtubeUrl:string){

        const newBlogger={
            id:+(new Date()),
            name:name,
            youtubeUrl:youtubeUrl
        }
        const generatedBlogger = bloggersRepositories.createBlogger(newBlogger)

        return (generatedBlogger)


    },
    async updateBloggers(id:number,name:string,youtubeUrl:string){
        return await bloggersRepositories.updateBloggers(id,name,youtubeUrl)

    },
    async deleteBloggers(id:number) {
        return await bloggersRepositories.deleteBloggers(id)
    },
}
