import {Request, Response, Router} from "express";

export const posts = Router({})



const listposts =[
    {id: 1, title: "Sity", shortDescription: "BigSity", content: "Fany", bloggerId: 1, bloggerName: "Pety"},
    {id: 2, title: "Music", shortDescription: "Disco", content: "Fany", bloggerId: 2, bloggerName: "Olya"},
    {id: 3, title: "Movie", shortDescription: "Trairel", content: "Inters", bloggerId: 3, bloggerName: "Vasya"},
    {id: 4, title: "Design", shortDescription: "Modern", content: "Interes", bloggerId: 4, bloggerName: "Masha"},
    {id: 5, title: "Picture", shortDescription: "Old", content: "Interes", bloggerId: 5, bloggerName: "Ihor"},


];



posts.get( "/", ( req:Request, res:Response ) => {
    res.send(listposts)
} );
posts.get("/:id", (req:Request, res:Response) => {
    const id = +req.params.id;
    const post = listposts.find(b => b.id === id);
    if(!post){
        res.sendStatus(404)
    }else {

        res.send(post)
    }



});
posts.post("/", (req:Request, res:Response) => {


    const newpost={
        id:+(new Date()),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: +(new Date()),
        bloggerName: req.body.bloggerName,

    }
    listposts.push(newpost)
    res.send(newpost)
});

posts.put("/:id", (req:Request, res:Response) => {
    let post = listposts.find(b => b.id === +req.params.id);
    if(post){
        post.title =req.body.title
        post.shortDescription = req.body.shortDescription
        post.content=req.body.content
        post.bloggerName= req.body.bloggerName
        res.sendStatus(204)
    }else {

        res.sendStatus(404)
    }

});
posts.delete("/:id", (req:Request, res:Response) => {
    const id = +req.params.id;
    const index:any = listposts.findIndex(b => b.id === id);

    if ( index === -1){
        res.send(404)
    }else {

        listposts.splice(index,1)
        res.sendStatus(204)
    }

});



