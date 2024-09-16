import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import courseRouter from "./routers/course.router.js"
import studentRouter from "./routers/student.router.js"

dotenv.config();

export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err)=>{
    if(err){
        console.error(err)
    }else{
        console.log("Mysql Connected")
    }
})

const app = express();
app.use(express.json())
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"],
    })
)

app.use('/api/course',courseRouter);
app.use('/api/student',studentRouter);

const PORT = 5000;
app.listen(PORT, () =>{
    console.log('Listening on port ' + PORT);
})
