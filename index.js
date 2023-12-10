const express=require("express")
const { connection } = require("./database")

const cors=require("cors")
const { userRouter } = require("./routes/userroutes")
const { postRouter } = require("./routes/postroutes")
const router = require("./routes/bmiroutes")
require("dotenv").config()
const app=express()
app.use(express.json())
app.use(cors());
app.get("/",(req,res)=>{
   
    res.send({msg:"hello from the app"})
})

app.use("/user",userRouter)
app.use("/posts",postRouter)
app.use("/bmi",router)
app.listen(8080,async()=>{
    try {
        await connection;
        console.log("db connected")
        console.log("serber connected")
    } catch (error) {
        console.log(error)
    }
})
