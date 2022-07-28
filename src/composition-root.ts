import {BloggersRepositories} from "./repositories/bloggers-db-repositories";
import {BloggersService} from "./domain/bloggers-service";
import {BloggersController} from "./contoller/bloggers-controller";


const bloggersRepositories = new BloggersRepositories()
export const bloggersService = new BloggersService(bloggersRepositories)
export const bloggersController = new BloggersController(bloggersService)
