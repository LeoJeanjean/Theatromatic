const port = 3000;
const dbName = 'database';
const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

const corsOptions = {
  origin: '*'
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
    collection.insertOne({
      "name" : user["name"],
      "email" : user["email"],
      "password" : user["password"],
      "characters" : []
    }).finally( () => {
      client.close();
    });
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
      result = [...result, (await collection.find({_id: new ObjectId(charactersID[characterID])}).toArray())[0]];
    }
    return(result);
  } catch(err) {
    console.log(err)
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
      "choosenImageUrl" : character["choosenImageUrl"]
    };
    
    const result = await collectionChar.insertOne(newCharacter);
    collectionUser.updateOne({
      "_id" : new ObjectId(character["userID"])
    }, {
      $push: {
        "characters" : result.insertedId
      }
    })
  } catch(e) {
    console.log(e);
  }
}

async function updateCharacter(character) {
  try {
    await client.connect();
    const database = client.db("database");
    const collection = database.collection("characters");
    await collection.updateOne({
      "_id" : new ObjectId(character._id)
    }, {
      $set: {
        "name" : character.name,
        "gender" : character.gender,
        "job" : character.job,
        "characteristics" : character.characteristics,
        "choosenImageUrl" : character.choosenImageUrl
      }
    });
  } catch(e) {
    console.log(e);
  }
}
async function deleteCharacter(userID,characterID) {
  try {
    await client.connect();
    const database = client.db("database");
    const collectionChar = database.collection("characters");
    const collectionUser = database.collection("users");
    await collectionChar.deleteOne({_id: new ObjectId(characterID)});
    await collectionUser.updateOne({
      "_id" : new ObjectId(userID)
    }, {
      $pull: {
        "characters" : new ObjectId(characterID)
      }
    });
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
  addUser(req.body["user"]);
  res.send('user is signup');
})

app.post('/login', async (req,res) => {
  const connctedUser = await checkUserExist(req.body["userInput"]["name"], req.body["userInput"]["password"]);
  res.send(connctedUser)
})

app.get('/characters/:charactersID', async (req, res) => {
  try {
    const charactersID = req.params.charactersID.split('-')
    const characters = await getCharacters(charactersID);
    res.send(characters);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/addCharacter', async (req,res) => {
  try {
    await addCharacter(req.body["character"])
    res.send('added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})
app.put('/updateCharacter', async (req,res) => {
  try {
    await updateCharacter(req.body["character"])
    res.send('updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})
app.delete('/deleteCharacter/:userID/:characterID', (req,res) => {
  try {
    deleteCharacter(req.params.userID,req.params.characterID);
    res.send("deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

app.post('/gpt', async (req, res) => {
  if(!req.body) return res.status(400).json({ success: false, error: 'You must provide a prompt' });
  try {
    const { prompt } = req.body || "";
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // text-ada-001 // ft-yewg6WZh0bEPtQew3eTs5Myb
      messages: [{"role":"user", "content": "hey"}],
      max_tokens: 64
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