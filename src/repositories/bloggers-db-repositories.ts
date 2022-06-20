import {bloggerCollection} from "./db";



export const bloggersRepositories = {
    async getBloggers(){
      return  bloggerCollection.find({}).project({_id:0}).toArray()

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
        

      const result = await bloggerCollection.insertOne(newBlogger)
        return (newBlogger)


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
