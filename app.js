const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
mongoose.connect("mongodb://localhost:27017/todolistDBS")

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

// const listItems = ["Bathing" ,"Breakfast" ,"DSA"];
// const workList = [];
const todoSchema = {
    task: String
};

const listSchema = {
    name: String,
    tasks: [todoSchema]
};

const Item = mongoose.model("Item", todoSchema);
const List = mongoose.model("List", listSchema);

// const items =[{
//         task: "Bathing"
//     },
//     {
//         task: "Breakfast"
//     },
//     {
//         task:"DSA"
//     }
// ];

// Item.insertMany(items, function(err){
//    if(err){
//        console.log(err);
//    } else {
//        console.log("Successfull insertion");
//    }
// });

app.get("/", (req, res)=> {
    
    Item.find({}, function(err, items){
        if(!err){
        res.render('list', {dayTitle: "TODAY" , listItems : items});
        }
    });
   
});


app.get("/:anyTitle", (req, res)=> {
    
    const title = req.params.anyTitle;
        List.findOne({name: title}, function(err, foundlist){
            if(!err){
                if(foundlist){
                    console.log(foundlist);
                    res.render('list', {dayTitle: title , listItems : foundlist.tasks});
                } else {
                    res.render('list', {dayTitle: title , listItems : []});
                }
            }
        });       
});




app.post("/", (req, res)=> {
    
    const insertItem = new Item({
                task: req.body.item
            }); 
        const listName = req.body.submit;  
        if(listName === "TODAY"){
            insertItem.save();
            res.redirect("/");
        } else {
            List.findOne({name:listName}, function(err, foundlist){
                if(foundlist){
                    foundlist.tasks.push(insertItem);
                    foundlist.save();
                } else {
                    const listItem = new List({
                        name: listName,
                        tasks: insertItem
                    });
                    listItem.save(); 
                }
            });
            res.redirect("/"+listName);
       }   
        
});



app.post("/delete", (req, res) => {
    const id = req.body.checkboxValue.slice(0,24);
    const listName = req.body.listName;

    if(listName === "TODAY"){
    Item.deleteOne({_id: id}, (err) => {
        if (!err) {
            console.log("Successfull Deletion!");
        }
    });
    res.redirect("/");
    } else {
        List.updateOne({name: listName}, {$pull: { tasks: {_id: id}}}, function(err , result){
            if(!err){
                console.log("Successfull Deletion!")
                res.redirect("/"+listName);   
            }
        });
    }
});



app.listen(3000, function() {
    console.log("Server listening at : 3000!");
});