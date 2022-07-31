import {Router} from "express";

import {commentValidation, inputValidationComment} from "../middlewares/input-validation-comments";
import {authMiddlewaresWithCheckOwn, authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";
import {container} from "../composition-root";
import {CommentController} from "../contoller/comment-controller";
import {inputValidationPost, likeStatusValidation} from "../middlewares/input-validation-midlewares-posts";
const commentsController= container.resolve(CommentController)

export const commentsRouter = Router({})


commentsRouter.put('/:id',
    idValidationMiddleware,
    authValidationMiddleware,
    authMiddlewaresWithCheckOwn,
    commentValidation,
    inputValidationComment,


    commentsController.updateComment.bind(commentsController));
commentsRouter.delete('/:id',
    idValidationMiddleware,
    authValidationMiddleware,
    authMiddlewaresWithCheckOwn,
    commentsController.deleteComment.bind(commentsController));
commentsRouter.get('/:id',
    idValidationMiddleware,
    commentsController.getComment.bind(commentsController));
commentsRouter.put('/:id/like-status',
    idValidationMiddleware,
    authValidationMiddleware,
    likeStatusValidation,
    inputValidationPost,


    commentsController.updateLikeStatus.bind(commentsController));