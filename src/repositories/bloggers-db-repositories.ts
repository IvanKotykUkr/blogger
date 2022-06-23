import {bloggerCollection} from "./db";



export const bloggersRepositories = {
    async getBloggers(){

        const bloggers = await bloggerCollection.find({}).project({_id:0}).toArray()
      return bloggers

    },
    async blooggersSeach(name:string){
        return  await bloggerCollection.find({name}).project({_id:0}).toArray()

    },
    async getBloggersPaginaton(size:number,number:number){
        const bloggers =  await bloggerCollection.find({}).skip(  ( number - 1 ) * size ).limit(size).project({_id:0}).toArray()
        return bloggers
    },
    async getBloggersSearchTerm(number:number,size:number,name:string){
        const bloggers =  await bloggerCollection.find({name}).skip(  ( number - 1 ) * size ).limit(size).project({_id:0}).toArray()
        return bloggers
    },


    async findBloggersById(id: number) {
        let blogger= await bloggerCollection.findOne({id:id} ,{projection:{_id:0}})
       if(blogger) {
           return blogger;
       }else {
          return null;
       }

    },


    async createBlogger(newBlogger:any){


      const result = await  bloggerCollection.insertOne(newBlogger)

      return newBlogger

    },
    async updateBloggers(id:number,name:string,youtubeUrl:string){

       const result = await  bloggerCollection.updateOne({id:id},{$set:{name:name,youtubeUrl:youtubeUrl}})




        return result.matchedCount === 1

    },
    async deleteBloggers(id:number) {
        const result = await bloggerCollection.deleteOne({id:id})
         return result.deletedCount === 1
        },


}
