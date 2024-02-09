import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db=new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "777888",
  port: 5432,
})
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/",async (req, res) => {
  try{
    const result=await db.query("select* from items");
    items=result.rows;
    res.render("index.ejs",{
      listTitle:"Today",
      listItems: items,
    });
  }
  catch(err){
    console.log(err);
  }

});

app.post("/add", async(req, res) => {
  try{
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1);",[item]);
  res.redirect('/');
  }
  catch(err){
    console.log(err);
  }
});

app.post("/edit",async (req, res) => {
    try{
      const item = req.body.updatedItemTitle;
      const id = req.body.updatedItemId;
      await db.query("update items set title=$1 where id=$2 ",[item,id]);
      res.redirect('/');
    }
    catch(err){
      console.log(err);
    }
});

app.post("/delete",async (req, res) => {
  try{
       const id=req.body.deleteItemId;
       await db.query("delete from items where id=$1",[id]);
       res.redirect('/');
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
