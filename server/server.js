const port = 3000;
const dbName = 'database';
const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

const corsOptions = {
  origin: 'http://localhost:5173'
};

app.use(cors(corsOptions));
app.use(express.json());

/// MONGO CONNECTION AND QUERIES /////////////////////////////////////////////////////////////////////////////////////////////////////////

const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
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

async function addCharacter(character) {
  try {
    await client.connect();
    const database = client.db("database");
    const collection = database.collection("characters");

    collection.insertOne({
      "name" : character["name"],
      "gender" : character["gender"],
      "job" : character["job"],
      "characteristics" : character["characteristics"],
    }).finally( () => {
      client.close();
    });
    console.log("inserted");
  } catch(e) {
    console.log(e);
  }
}

/// OPENAI GPT-3 QUERIES ///////////////////////////////////////////////////////////////////////////////////////////////////

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

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

app.post('/addCharacter', (req,res) => {
  console.log(req.body["character"]["name"]);
  addCharacter(req.body["character"]);
  res.send('character is added');
})

app.post('/gpt', async (req, res) => {
  if(!req.body) return res.status(400).json({ success: false, error: 'You must provide a prompt' });
  try {
    const { prompt } = req.body || "";
    const response = await openai.createCompletion({
      model: "text-ada-001",
      prompt: `${prompt}`,
      max_tokens: 64,
      temperature: 0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      //stop: ["\n"], //Le stop cause la data d'être vide si y'a pas de body !
    });

    return res.status(200).json({
      success: true,
      data: response.data.choices[0].text.replace('\n','')
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "There was an issue on the server",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});