import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {
    bloggerIdtValidation,
    contentValidation, inputValidationPost,
    shortDescriptionValidation,
    titleValidation,
} from "../midlewares/input-validation-midlewares-posts";
import {basicAuthorization} from "../midlewares/basicAuth";
import {authMidlewares} from "../midlewares/auth-midlewares";
import {commentsService} from "../domain/comments-service";
import {commentValidation, inputValidationComment} from "../midlewares/input-validation-comments";


export const postsRouter = Router({})





postsRouter.get( "/", async ( req:Request, res:Response ) => {
    const pagenumber= req.query.PageNumber ||  1;
    const pagesize = req.query.PageSize ||  10;
   const posts = await postsService.getPosts(+pagenumber,+pagesize)
    res.status(200).send(posts)
} );
postsRouter.get("/:id", async (req:Request, res:Response) => {
    const post = await postsService.findPostsById(req.params.id)
    if(!post){
        res.sendStatus(404)
    }else {

        res.send(post)
    }



});

postsRouter.post("/",

    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

   async (req:Request, res:Response) => {
const newPost = await postsService.createPost(
    req.body.title,
    req.body.shortDescription,
    req.body.content,
    req.body.bloggerId)
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

postsRouter.put("/:id",
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

    async (req:Request, res:Response) => {
   const isUpdated = await postsService.updatePost(req.params.id,req.body.title,req.body.shortDescription,req.body.content,req.body.bloggerId)




        if (isUpdated){
            res.status(204).json(isUpdated)
        }else {
            if (isUpdated===null) {
                res.status(400).json({
                    errorsMessages:
                        [{
                            message: "Invalid value",
                            field: "bloggerId"
                        }]
                })


            }else {
                res.send(404)
           }
        }

    });

postsRouter.delete("/:id", basicAuthorization,async (req:Request, res:Response) => {
    const isDeleted  = await postsService.deletePost(req.params.id)

    if ( isDeleted){
        res.sendStatus(204)
    }else {

        res.sendStatus(404)

    }
});
postsRouter.post('/:id/comments',
    commentValidation,
    inputValidationComment,
    authMidlewares,
    async (req:Request,res:Response)=>{
    const newComment = await postsService.createCommentsByPost( req.params.id,req.body.content,req.user!.id,req.user!.userName)
        if(!newComment){
            res.send(404)
        }else {
            res.status(201).send(newComment)

        }
});
postsRouter.get('/:id/comments', async (req:Request,res:Response)=>{
    const pagenumber= req.query.PageNumber ||  1;
    const pagesize = req.query.PageSize ||  10;
    const allComment = await postsService.sendAllCommentsByPostId(req.params.id,+pagenumber,+pagesize)
   if(!allComment){
       res.send(404)
   }else {
       res.status(200).send(allComment)

   }
});




