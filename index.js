const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const port = 3000
const orders = require('./routes/orders')
const register = require("./routes/register");
const login = require("./routes/login");
const stripe = require('./routes/stripe')
// const meals = require("./meals");
const mealRoute=require("./routes/mealRoute")

require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/Healthy").then(()=>{
    console.log("connected to the healthy db")
}).catch((err)=>{
    console.log(err)
})


app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use("/uploads" , express.static('uploads'))

// app.use(cors({
//     origin: ['http://localhost:3000']
//   }));
  
app.get("/",(req,res)=>{
    res.send("welcome to our shop api")
    console.log('welcome to our shop api')
})
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/orders", orders);
app.use("/api/stripe" , stripe)
app.use('/meals' , mealRoute)
// app.use(multipart());

// app.get("/meals", (req, res) => {
//     res.send(meals);
//   });

app.listen(port , ()=> console.log(`app listens on port : ${port}`))