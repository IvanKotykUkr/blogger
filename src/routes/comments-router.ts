import {Router} from "express";


import {commentValidation, inputValidationComment} from "../middlewares/input-validation-comments";
import {authMiddlewaresWithCheckOwn, authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";
import {commentsController} from "../composition-root";

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