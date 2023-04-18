const port = 3000;
const dbName = 'database';
const express = require('express');
const app = express();

const uri = 'mongodb+srv://leojj:theatromatic@theatromatic.wwn27al.mongodb.net/?retryWrites=true&w=majority';
//Changer                  ^^^^^ ^^^^^^^^^^^^

/// MONGO CONNECTION AND QUERIES /////////////////////////////////////////////////////////////////////////////////////////////////////////

const { MongoClient, ServerApiVersion } = require('mongodb');
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

async function getCharacters() {
  try {
    await client.connect();
    const database = client.db("database");
    const collection = database.collection("characters");

    // Query the collection and log the result
    const result = await collection.findOne();
    console.log(result);
    return(result);
  } finally {
    await client.close();
  }
}

/// EXPRESS ROUTES /////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  
app.get('/characters', async (req, res) => {
try {
    const characters = await getCharacters();
    res.send(characters);
} catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
}
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});