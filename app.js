import express from "express"
import cors from "cors"

import bodyParser from "body-parser";
import userRouter from './Auth_backend/routes/user.route.js'

const app = express();

app.use(cors({
    
    credentials: true
}))

app.use(express.json({limit: "16kb"}))

app.use(express.static("public"))

app.use(bodyParser.json())



app.use("/Api/v1/users",userRouter);

export {app};