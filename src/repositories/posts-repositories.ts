import {bloggers, bloggersRepositories} from "./bloggers-repositories";



const listposts =[
    {id: 1, title: "Sity", shortDescription: "BigSity", content: "Fany", bloggerId:1, bloggerName:"Zoriana"},
    {id: 2, title: "Music", shortDescription: "Disco", content: "Fany", bloggerId:2, bloggerName:"Masha"},
    {id: 3, title: "Movie", shortDescription: "Trairel", content: "Inters", bloggerIdo:3, bloggerName:"Petya"},
    {id: 4, title: "Design", shortDescription: "Modern", content: "Interes", bloggerId:4, bloggerName:"Vasya"},
    {id: 5, title: "Picture", shortDescription: "Old", content: "Interes", bloggerId:5, bloggerName:"Ihor"},


];



export const postsRepositories = {
    allposts : (listposts),
    findPostsById(id:number){
        const post = listposts.find(b => b.id === id);
        return post;
    },
    createPost(title: string, shortDescription: string, content: string, bloggerId: number){

       let bloggerName:any =bloggersRepositories.findBloggersById(bloggerId)


        const newpost= {
            id: +(new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName.name,
        }

        listposts.push(newpost)
        return(newpost)
    },
    updatePost(id:number,title: string, shortDescription: string, content: string, bloggerId: number,){
        let bloggerNameUp:any =bloggersRepositories.findBloggersById(bloggerId)
        let upPost = listposts.find(p => p.id === id);
       
      if( upPost){
           upPost.title = title,
           upPost.shortDescription= shortDescription,
           upPost.content = content,
           upPost.bloggerId = bloggerId,
           upPost.bloggerName = bloggerNameUp.name

           return upPost;
        }

    },
    deletePost(id:number){
        for (let i=0;i<listposts.length;i++) {
            if (listposts[i].id === id) {
               listposts.splice(i, 1)
                return true;
            }
        }



    }
}