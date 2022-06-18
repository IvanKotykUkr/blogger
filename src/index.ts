import express, {Request,Response} from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {rundDb} from "./repositories/db";




const app = express();
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5001


app.use('/bloggers', bloggersRouter )
app.use('/posts', postsRouter)

const startApp = async ()=> {
    await rundDb()

    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}

startApp()