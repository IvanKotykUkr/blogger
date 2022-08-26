import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {usersRouter} from "./routes/users-router";
import {testingRouter} from "./routes/testing-router";
import cookieParser from "cookie-parser";
import {pairQuizGameRouter} from "./routes/pairquizgame-router";

dotenv.config();


const app = express();

app.use(bodyParser.json())
app.use(cors())
app.enable('trust proxy')
app.use(cookieParser())


const port = process.env.PORT || 5001


app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/users', usersRouter)
app.use('/testing', testingRouter)
app.use('/pair-game-quiz', pairQuizGameRouter)


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}

startApp()