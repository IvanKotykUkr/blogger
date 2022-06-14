import {Request, Response, Router} from "express";
import {postsRepositories} from "../repositories/posts-repositories";
import {
    bloggerIdtValidation,
    contentValidation, inputValidationPost,
    shortDescriptionValidation,
    titleValidation
} from "../midlewares/input-validation-midlewares-posts";


export const posts = Router({})





posts.get( "/", ( req:Request, res:Response ) => {
   const listposts = postsRepositories.allposts
    res.send(listposts)
} );
posts.get("/:id", (req:Request, res:Response) => {
    const post = postsRepositories.findPostsById(+req.params.id)
    if(!post){
        res.sendStatus(404)
    }else {

        res.send(post)
    }



});

posts.post("/",
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,
    (req:Request, res:Response) => {
const newPost = postsRepositories.createPost(req.body.title,req.body.shortDescription,req.body.content,+req.body.bloggerId)
        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).json({
                errorsMessages:
                    [{
                        message: "Invalid value",
                        field: "bloggerId"
                    }]
            })

        }
});

posts.put("/:id",
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost, (req:Request, res:Response) => {
   const isUpdated = postsRepositories.updatePost(+req.params.id,req.body.title,req.body.shortDescription,req.body.content,+req.body.bloggerId)




        if (isUpdated){
            res.status(204).json(isUpdated)
        }else {
            if (isUpdated!==null) {
                res.send(404).json({
                    errorsMessages:
                        [{
                            message: "Invalid value",
                            field: "bloggerId"
                        }]
                })

            }else {
                res.sendStatus(400)
           }
        }

    });

posts.delete("/:id", (req:Request, res:Response) => {
    const isDeleted  = postsRepositories.deletePost(+req.params.id)

    if ( isDeleted){
        res.sendStatus(204)
    }else {

        res.sendStatus(404)

    }
});



