import {BloggersRepositories} from "./repositories/bloggers-db-repositories";
import {BloggersService} from "./domain/bloggers-service";
import {BloggersController} from "./contoller/bloggers-controller";
import {PostsService} from "./domain/posts-service";
import {PostsRepositories} from "./repositories/posts-db-repositories";
import {CommentsService} from "./domain/comments-service";
import {PostsController} from "./contoller/posts-controller";
import {CommentsRepositories} from "./repositories/comments-db-repositories";
import {CommentController} from "./contoller/comment-controller";
import {UserRepositories} from "./repositories/user-db-repositories";
import {EmailManager} from "./managers/email-manager";
import {AuthService} from "./domain/auth-service";
import {EmailAdapter} from "./adapters/email-adapter";
import {JwtService} from "./aplication/jwt-service";
import {TokenService} from "./domain/token-service";
import {TokenRepositories} from "./repositories/token-db-repositories";
import {AuthController} from "./contoller/auth-controller";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./contoller/users-controller";




export const jwtService = new JwtService()

const emailAdapter = new EmailAdapter()
const emailManager = new EmailManager(emailAdapter)

const tokenRepositories = new TokenRepositories()
export const tokenService = new TokenService(tokenRepositories)

const userRepositories = new UserRepositories()
export const usersService = new UsersService(userRepositories)

const authService = new AuthService(userRepositories, emailManager)

export const usersController = new UsersController(usersService, authService)


export const authController = new AuthController(jwtService, authService, tokenService)

const commentsRepositories = new CommentsRepositories()
export const commentsService = new CommentsService(commentsRepositories)
export const commentsController = new CommentController(commentsService)


const postsRepositories = new PostsRepositories()
const postsService = new PostsService(postsRepositories, commentsService)
export const postsController = new PostsController(postsService)

const bloggersRepositories = new BloggersRepositories()
export const bloggersService = new BloggersService(bloggersRepositories, postsService)
export const bloggersController = new BloggersController(bloggersService)

