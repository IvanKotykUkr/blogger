
import {bloggersRepositories} from "../repositories/bloggers-db-repositories";
import {postsService} from "./posts-service";


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
    async getPostsbyIdBlogger(id:number) {
        let blogger: any = await this.findBloggersById(id)
        if (blogger){
            let findPosts:any= await postsService.findPostsByIdBlogger(blogger.id)
            return findPosts
        }else {
            return null
        }


    },
    async createPostbyBloggerId(id:number,title:string,shortDescription:string,content:string){
        let blogger: any = await this.findBloggersById(id)
        if (blogger) {
            let newPosts: any = await postsService.createPostByBloggerId(blogger.id, title, shortDescription, content,blogger.name)
            return newPosts
        }else {
            return  null
        }

    }
}
