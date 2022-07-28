import {Router} from "express";
import {
    inputValidationBlogger,
    nameValidation,
    youtubeUrlValidation,
} from "../middlewares/input-validation-midlewares-bloggers";
import {basicAuthorization} from "../middlewares/basicAuth";
import {
    contentValidation,
    inputValidationPost,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/input-validation-midlewares-posts";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";
import {bloggersController} from "../composition-root";


export const bloggersRouter = Router({})


bloggersRouter.get("/:id",
    idValidationMiddleware,
    bloggersController.getBlogger.bind(bloggersController));

bloggersRouter.get("/",
    bloggersController.getBloggers.bind(bloggersController));
bloggersRouter.post("/",
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    bloggersController.createBlogger.bind(bloggersController));

bloggersRouter.put("/:id",
    idValidationMiddleware,
    basicAuthorization,
    nameValidation,
    youtubeUrlValidation,
    inputValidationBlogger,
    bloggersController.updateBlogger.bind(bloggersController));
bloggersRouter.delete("/:id",
    idValidationMiddleware,
    basicAuthorization,
    bloggersController.deleteBlogger.bind(bloggersController));
bloggersRouter.get('/:id/posts',
    bloggersController.getPostByBlogger.bind(bloggersController));
bloggersRouter.post('/:id/posts',
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationPost,
    bloggersController.createPostByBloger.bind(bloggersController));
