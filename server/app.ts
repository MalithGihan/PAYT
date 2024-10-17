require('dotenv').config();
import express, { Request,Response,NextFunction } from 'express'
export const app = express()
import cors from "cors"
import cookieParser from 'cookie-parser'
import {ErrorMiddleware} from './middleware/error';
import userRouter from './routes/user.routes';
import notfirouter from './routes/notification.routes';

app.use(express.json({limit:"50mb"}))
app.use(cookieParser())

app.use(cors({
    origin: ['http://localhost:3000'],  // server hosting link
    credentials: true
}))

app.use("/api/v1",userRouter)  // user routes
app.use("/api/v1",notfirouter) // notification routes

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // or your frontend URL
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get("/test", (req:Request, res: Response, next:NextFunction) =>{
    res.status(200).json({
        success:true,
        message:"API is working",
    })
})

app.all("*",(req:Request, res: Response, next:NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404;
    next(err)
})

app.use(ErrorMiddleware)