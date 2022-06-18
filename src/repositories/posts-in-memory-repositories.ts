import { bloggersRepositories} from "./bloggers-in-memory-repositories";




const listposts =[
    {id: 1, title: "Sisty", shortDescription: "BigSity", content: "Fany", bloggerId:1, bloggerName:"Zoriana"},

];



export const postsRepositories = {
   async getPosts(){
        return listposts
    },
    async findPostsById(id:number){
        const post = listposts.find(b => b.id === id);
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
            listposts.push(newpost)

        } else {
           newpost = null
        }




        return(newpost)
    },
   async updatePost(id:number,title: string, shortDescription: string, content: string, bloggerId: number,){
        let blogger:any = await bloggersRepositories.findBloggersById(bloggerId)

        let upPost:any;

        if( blogger){
            upPost= listposts.find(p => p.id === id);
            if (upPost)
                upPost.title = title,
                    upPost.shortDescription= shortDescription,
                    upPost.content = content,
                    upPost.bloggerId = bloggerId,
                    upPost.bloggerName = blogger.name
            return upPost;
        }else {
            upPost = null
        }
        return (upPost)

    },


    async deletePost(id:number){
        for (let i=0;i<listposts.length;i++) {
            if (listposts[i].id === id) {
               listposts.splice(i, 1)
                return true;
            }
        }



    }
}