import express, { Request, Response, Express } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import authRouter from './router/user';
import errorHandler from './middleware/errorHandler';

config();
const app = express();
const PORT = process.env.PORT || 3004;

const password = process.env.PASSWORD;
const database = process.env.DATABASE_NAME;
const uri: string = `mongodb+srv://admin:${password}@my-app-cluster.cgli7sm.mongodb.net/${database}`;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(errorHandler);

mongoose.connect(uri).then(()=>{
    console.log("Database connected successfully.");
});

app.use("/user",authRouter);

app.listen(PORT,()=>{
    console.log(`App is running on port http://localhost:${PORT}`)
})

app.get("/", (req, res) => {
  res.send("<h1>App is connected.</h1>");
});