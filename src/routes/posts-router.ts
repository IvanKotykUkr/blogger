import {Router} from "express";
import {
    bloggerIdtValidation,
    contentValidation,
    inputValidationPost,
    shortDescriptionValidation,
    titleValidation,
} from "../middlewares/input-validation-midlewares-posts";
import {basicAuthorization} from "../middlewares/basicAuth";
import {commentValidation, inputValidationComment} from "../middlewares/input-validation-comments";
import {authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";
import {postsController} from "../composition-root";


export const postsRouter = Router({})


postsRouter.get("/:id",
    idValidationMiddleware,
    postsController.getPost.bind(postsController));

postsRouter.get("/", postsController.getPosts.bind(postsController));


postsRouter.post("/",

    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

    postsController.createPost.bind(postsController));

postsRouter.put("/:id",
    idValidationMiddleware,
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

    postsController.updatePost.bind(postsController));

postsRouter.delete("/:id",
    idValidationMiddleware,
    basicAuthorization,
    postsController.deletePosts.bind(postsController));
postsRouter.post('/:id/comments',
    authValidationMiddleware,
    commentValidation,
    inputValidationComment,

    postsController.createComment.bind(postsController));
postsRouter.get('/:id/comments',
    idValidationMiddleware,
    postsController.getComment.bind(postsController));




