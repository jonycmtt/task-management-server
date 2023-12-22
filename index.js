const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || '5000'



app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jsqvega.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


   const taskCollection = client.db('taskManagementDB').collection("task")

   app.get('/task', async(req,res) => {
    const result = await taskCollection.find().toArray();
    res.send(result);
   })

   app.get('/task/:id', async(req,res) => {
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)};
    const result = await taskCollection.findOne(filter);
    res.send(result)
   })


   app.post('/task', async(req,res) => {
    const createTask = req.body;
    const result = await taskCollection.insertOne(createTask);
    res.send(result)

   })

   app.patch('/task/:id', async(req,res) => {
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)}
    const body = req.body;
    console.log(body);
    const updatedDoc = {
      $set: {
        status: body.status
      },
    };
    console.log(updatedDoc);
    const result = await taskCollection.updateOne(filter,updatedDoc);
    console.log(result);
    res.send(result)
   })
    
   app.delete("/task/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  });

  app.patch("/task/update/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id)};
    const updateTask = req.body;
    console.log(updateTask);
    
    const updatedDoc = {
      $set: {
        title: updateTask.title,
        dateline: updateTask.dateline,
        description: updateTask.description,
      },
    };
    console.log(updatedDoc);
    const result = await taskCollection.updateOne(filter, updatedDoc);
    res.send(result);
  });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send({ Message: "task management Server" });
  });
  
  app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
  