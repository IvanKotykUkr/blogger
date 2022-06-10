import {Request, Response, Router} from "express";

export const bloggersRouter = Router({})



const bloggers =[
    {id:1,name:'Ihor',youtubeUrl:'snocfjdsoifjs'},
    {id:2,name:'Vasya',youtubeUrl:'dsaklmfokdso'},
    {id:3,name:'Petya',youtubeUrl:'skjidpjweipdji'},
    {id:4,name:'Borya',youtubeUrl:'zxpzkocomdcs'},

];



bloggersRouter.get( "/", ( req:Request, res:Response ) => {
    res.send(bloggers)
} );
bloggersRouter.get("/:id", (req:Request, res:Response) => {
    const id = +req.params.id;
    const blogger = bloggers.find(b => b.id === id);
    if(!blogger){
        res.sendStatus(404)
    }else {

        res.send(blogger)
    }



});
bloggersRouter.post("/", (req:Request, res:Response) => {


    const newBlogger={
        id:+(new Date()),
        name:req.body.name,
        youtubeUrl:req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.send(newBlogger)
});

bloggersRouter.put("/:id", (req:Request, res:Response) => {
    let blogger = bloggers.find(b => b.id === +req.params.id);
    if(blogger){
        blogger.name = req.body.name
        blogger.youtubeUrl= req.body.youtubeUrl
        res.sendStatus(204)
    }else {

        res.sendStatus(404)
    }

});
bloggersRouter.delete("/:id", (req:Request, res:Response) => {
    const id = +req.params.id;
    const index:any = bloggers.find(b => b.id === id);

    if ( index === -1){
        res.send(404)
    }else {

        bloggers.splice(index,1)
        res.sendStatus(204)
    }

});



