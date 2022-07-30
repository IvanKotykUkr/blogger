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
import {container} from "../composition-root";
import {BloggersController} from "../contoller/bloggers-controller";

const bloggersController=container.resolve(BloggersController)

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
bloggersRouter.get('/:id/posts',idValidationMiddleware,
    bloggersController.getPostByBlogger.bind(bloggersController));
bloggersRouter.post('/:id/posts',
    idValidationMiddleware,
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationPost,
    bloggersController.createPostByBloger.bind(bloggersController));
