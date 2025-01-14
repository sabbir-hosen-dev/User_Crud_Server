const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

const port = process.env.PORT || 600

app.use(cors())
app.use(express.json());



const uri = "mongodb+srv://sabbir:crud_Cluster0@cluster0.oe1x1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("UsersData");
    const userCollection = db.collection("users")

    app.get("/users", async (req,res) => {

      const cousor = userCollection.find()
      const result = await cousor.toArray()
      res.send(result)
    })

    app.post("/users", async (req,res) => {
      const user = req.body
      
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    app.delete("/users/:id", async (req,res) => {
      const id = req.params.id

      const query = {_id : new ObjectId(id)}

      const result = await userCollection.deleteOne(query)

      res.send(result)

    })

    app.put("/users/:id", async ( req,res) => {
      const user = req.body;
      const id = req.params.id; 

      const filter = {_id : new ObjectId(id)};
      const update = {$set: user}

      const result = await userCollection.updateOne(filter,update)
      
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res) => {
  res.send("Crud App Running")
})

app.listen(port, () => {
  console.log(`Crud app Running : http://localhost:${port}`)
})
