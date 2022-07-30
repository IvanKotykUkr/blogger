
import "reflect-metadata";
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
import {Container} from "inversify";
import {PostsHelper} from "./domain/helpers/posts-helper";

/*


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
const postsService = new PostsService(postsRepositories, commentsService,bloggersService)
export const postsController = new PostsController(postsService)

const bloggersRepositories = new BloggersRepositories()
export const bloggersService = new BloggersService(bloggersRepositories, postsService)
 const bloggersController = new BloggersController(bloggersService)


 */
export const container = new Container();
container.bind(BloggersController).to(BloggersController)
container.bind<BloggersService>(BloggersService).to(BloggersService)
container.bind<BloggersRepositories>(BloggersRepositories).to(BloggersRepositories)
container.bind(PostsController).to(PostsController)
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<PostsRepositories>(PostsRepositories).to(PostsRepositories)
container.bind(CommentController).to(CommentController)
container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<CommentsRepositories>(CommentsRepositories).to(CommentsRepositories)
container.bind(AuthController).to(AuthController)
container.bind(UsersController).to(UsersController)
container.bind<AuthService>(AuthService).to(AuthService)
container.bind<UsersService>(UsersService).to(UsersService)
container.bind<UserRepositories>(UserRepositories).to(UserRepositories)
container.bind<TokenService>(TokenService).to(TokenService)
container.bind<TokenRepositories>(TokenRepositories).to(TokenRepositories)
container.bind<EmailManager>(EmailManager).to(EmailManager)
container.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter)
container.bind<JwtService>(JwtService).to(JwtService)
container.bind<PostsHelper>(PostsHelper).to(PostsHelper)






