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
import {LikesRepositories} from "./repositories/likes-repositories";
import {CommentHelper} from "./domain/helpers/comment-helper";
import {LikeHelper} from "./domain/helpers/like-helper";
import {BloggerHelper} from "./domain/helpers/blogger-helper";
import {UserHelper} from "./domain/helpers/user-helper";
import {PairQuizGameController} from "./contoller/pairquizgame-controller";
import {PairQuizGameService} from "./domain/pairquizgame-service";
import {PairQuizGameHelper} from "./domain/helpers/pairquizgame-helper";
import {GameRepositories} from "./repositories/game-db-repositories";
import {ScoreGameRepositories} from "./repositories/score-game-repositories";
import {TopRatedHelper} from "./domain/helpers/toprated-helper";

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
container.bind<LikesRepositories>(LikesRepositories).to(LikesRepositories)
container.bind<CommentHelper>(CommentHelper).to(CommentHelper)
container.bind<LikeHelper>(LikeHelper).to(LikeHelper)
container.bind<BloggerHelper>(BloggerHelper).to(BloggerHelper)
container.bind<UserHelper>(UserHelper).to(UserHelper)
container.bind<PairQuizGameController>(PairQuizGameController).to(PairQuizGameController)
container.bind<PairQuizGameService>(PairQuizGameService).to(PairQuizGameService)
container.bind<PairQuizGameHelper>(PairQuizGameHelper).to(PairQuizGameHelper)
container.bind<GameRepositories>(GameRepositories).to(GameRepositories)
container.bind<ScoreGameRepositories>(ScoreGameRepositories).to(ScoreGameRepositories)
container.bind<TopRatedHelper>(TopRatedHelper).to(TopRatedHelper)






