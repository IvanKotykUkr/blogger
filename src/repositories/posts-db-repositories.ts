import { bloggersRepositories} from "./bloggers-db-repositories";
import { postsCollection} from "./db";




const __listposts =[
    {id: 1, title: "Sisty", shortDescription: "BigSity", content: "Fany", bloggerId:1, bloggerName:"Zoriana"},

];



export const postsRepositories = {
   async getPosts(){
        return postsCollection.find({}).toArray()
    },
    async findPostsById(id:number){
        const post =  postsCollection.findOne({id:id})
        return post;
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: number){

       let blogger: any = await bloggersRepositories.findBloggersById(bloggerId)
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
            const result = await postsCollection.insertOne(newpost)

        } else {
           newpost = null
        }

        return(newpost)
    },
   async updatePost(id:number,title: string, shortDescription: string, content: string, bloggerId: number,){
        let blogger:any = await bloggersRepositories.findBloggersById(bloggerId)



        if( blogger){
            const result = await  postsCollection.updateOne({id:id},{$set:{title:title,shortDescription:shortDescription,content:content,bloggerId:bloggerId,bloggerName:blogger.name}})
            return result.matchedCount === 1
        }else {
            return null
        }


    },


    async deletePost(id:number) {
        const result = await  postsCollection.deleteOne({id:id})
        return result.deletedCount === 1


   }

}