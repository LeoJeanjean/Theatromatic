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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

async function addUser(user) {
  
  try {
    await client.connect();
    const database = client.db("database");
    const collection = database.collection("users");

    // Query the collection and log the result
   // const result = await collection.findOne();
    collection.insertOne({
      "name" : user["name"],
      "email" : user["email"],
      "password" : user["password"],
      "characters" : []
    }).finally( () => {
      client.close();
    });
    console.log("inserted");
  } catch(e) {
    console.log(e);
  }
 
}

async function checkUserExist(inputName, inputPassword) {

  try {
    await client.connect();
    const database = client.db("database");
    const collection = database.collection("users");
    const result = await  collection.find(
      {
        "name" : inputName
      }
    ).toArray().then((userData) => {
      if (userData.length > 0) {
        if (userData[0]["password"] === inputPassword) {
          return userData[0];
        } else {
          return false;
        }
      } else {
        return false;
      }

    })
    return(result);
  } catch (error) {
    console.error(error);
  }
}


async function getCharacters(charactersID) {
  try {
    await client.connect();
    const database = client.db("database");
    const collection = database.collection("characters");
    let result = [];
    for (const characterID in charactersID) {
      result = [...result,(await collection.find({_id: new ObjectId(charactersID[characterID])}).toArray())[0]];
    }
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
    const collectionChar = database.collection("characters");
    const collectionUser = database.collection("users");

    const newCharacter = {
      "name" : character["name"],
      "gender" : character["gender"],
      "job" : character["job"],
      "characteristics" : character["characteristics"],
    };
    
    const result = await collectionChar.insertOne(newCharacter);
    console.log(result.insertedId + " is the id");

    collectionUser.updateOne({
      "_id" : new ObjectId(character["userID"])
    }, {
      $push: {
        "characters" : result.insertedId
      }
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
  
app.post('/signup', (req,res) => {
  console.log(req.body["user"]["name"]);
  addUser(req.body["user"]);
  res.send('user is signup');
})

app.post('/login', async (req,res) => {
  const connctedUser = await checkUserExist(req.body["userInput"]["name"], req.body["userInput"]["password"]);
  res.send(connctedUser)
})

app.get('/characters/:charactersID', async (req, res) => {
try {
    charactersID = req.params.charactersID.split('-')
    const characters = await getCharacters(charactersID);
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