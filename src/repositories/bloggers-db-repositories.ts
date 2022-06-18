import {bloggerCollection} from "./db";



export const bloggersRepositories = {
    async getBloggers(){
      return  bloggerCollection.find({}).toArray()

    },

    async findBloggersById(id: number) {
        let blogger= await bloggerCollection.findOne({id:id})
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
