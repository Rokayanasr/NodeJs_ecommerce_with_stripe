const mealController=require("../controllers/mealController")
const express = require('express')
const multer = require('multer');
const path = require("path")
const route = express.Router()


// const path = require('path');

const Storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,".." , "uploads"))    
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})


const upload =multer({storage:Storage});


route.post('/add-item', upload.single('imageFile')  ,async(req,res)=>{
    let imageFile=req.file.filename;
    try{ 
        let{title,category,description,price,ingrediants,exclude} = req.body
        let data = await mealController.addNew(title,category,description,price,ingrediants,exclude,imageFile)
        // console.log(imageFile)
        res.send("ok"+ data)
    }catch(e){
        res.status(500).send('server error')
    }
})


route.get('/' , (req,res)=>{
    res.send('hello in meals route')
})

route.get("/get-all" , async(req,res)=>{
    try{
        let data = await mealController.getAllMeals()
        if(data){
            res.json({
                items:data,
                msg:"ok"
            })
        }else {
            res.status(403).send("not found")
        }
    }catch(e){
        res.status(500).send('server error')
    }
})



route.delete('/delete-item' , async(req,res)=>{
    try{
        let {id} = req.body
        let data = await mealController.deleteItem(id)
        res.send("ok")

    }catch(e){
        res.status(500).send('server error')
    }
})

route.patch('/edit-item' , async(req,res)=>{
    try{
        let{id,image,title,category,description,price,ingrediants,exclude} = req.body
        let data = await mealController.editItem(id,image,title,category,description,price,ingrediants,exclude)
        res.send("item edited succesfully")
    }catch(e){
        res.status(500).send('server error')
    }
})

route.post("/filter-by-category" , async(req,res)=>{
    try{
       let{category}=req.body
       let data = await mealController.filterMealsCat(category)
       res.send(data)
    }catch(e){
        res.status(500).send('server error')
    }
})


route.post("/filter-by-price" , async(req,res)=>{
    try{
       let{price}=req.body
       let data = await mealController.filterMealsPri(price)
       res.send(data);
    }catch(e){
        res.status(500).send('server error')
    }
})
module.exports = route;

