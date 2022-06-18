import {postsRepositories} from "../repositories/posts-db-repositories";
import {bloggersService} from "./bloggers-service";
import {postsCollection} from "../repositories/db";


export const postsService = {
    async getPosts(){
        return postsRepositories.getPosts()
    },
    async findPostsById(id:number){
        return   postsRepositories.findPostsById(id)

    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: number){

        let blogger: any = await bloggersService.findBloggersById(bloggerId)
        let newpost;

        if (blogger) {
            newpost= {
                id: +(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: blogger.name,
            }
            const generatedPost = postsRepositories.createPost(newpost)
            return generatedPost
        } else {
            newpost = null
        }

        return(newpost)
    },
    async updatePost(id:number,title: string, shortDescription: string, content: string, bloggerId: number,){
        let blogger:any = await bloggersService.findBloggersById(bloggerId)

        let upPost= await postsService.findPostsById(id)

        if( blogger) {
            if (upPost)  {
               return   await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId, blogger.name)


            } else {
                return undefined
            }

        }else {
            return null
        }
    },


    async deletePost(id:number) {
       return await postsRepositories.deletePost(id)


    }

}