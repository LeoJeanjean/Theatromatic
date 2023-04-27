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
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
Je vais te donner un resume de texte et un ou plusieurs personnage avec des paramètre a respecter . Ecris moi un scenario  impliquant ces personnages et le resume, sous la forme suivante: [ {"s":  {nom du/des item(s) entre 1 et 3 et leurs nombres si plusieurs et la position initial des personnages si ils sont là dès le debut par exemple table: position dans une grille de 5 (0 à 4) par 8 (0 à 7)  },{ "b" : phrase introductive }, { "d":  replique du personnage qui parle  sans mettre son nom pour renseigner qu'il parle, "t" : nom du personnage qui parle  si il n'y en a pas car il s'agit jute d'une action mettre null, "a": action n'impliquant pas les répliques de personnages s'il y en a, "p": [position du personnage dans une grille de 5 (0 à 4) par 8 (0 à 7)  il ne peut y avoir 2 elements dans la meme position, nom du personnage positionne] comme [1,2,Bebo]}, répéter sur ce même model à chaque fois que quelque chose de nouveau arrive comme action ou personnage prenant la parole, {"E": texte de fin} ].
Exemple: Bebo: grand, bête, brave, guerrier. Jeanne: petite, feroce, sorciere. Ils se battent dans un bar.
[{"s": {"table": [2, 5], "Bebo": [0, 2], "Jeanne": [4, 5]}}, {"b": "Bebo et Jeanne se sont rencontrés dans un bar mal famé."},
{"d": "Je vais te casser en deux, petit morceau de viande !", "t": "Bebo", "p": [0, 2, "Bebo"]},
{"d": "Je ne suis pas si facilement brisable, gros tas de muscles.", "t": "Jeanne", "p": [4, 5, "Jeanne"]},
{"a": "Bebo charge Jeanne avec toute sa force, mais Jeanne utilise sa magie pour le faire tomber par terre.", "p": [2, 2, null]},
{"d": "Je suis impressionné, tu es plus forte que tu n'en as l'air.", "t": "Bebo", "p": [2, 2, "Bebo"]},
{"d": "Tu as sous-estimé mes pouvoirs, Bebo.", "t": "Jeanne", "p": [4, 5, "Jeanne"]},
{"a": "Bebo et Jeanne continuent à se battre, mais finalement Jeanne l'emporte avec un sortilège qui le transforme en souris.", "p": [2, 2, null]},
{"d": "C'est terminé, Bebo. Tu n'es plus qu'un petit rongeur maintenant.", "t": "Jeanne", "p": [4, 5, "Jeanne"]},
{"d": "Je me vengerai, sorcière !", "t": "Bebo (sous forme de souris)", "p": [2, 2, "Bebo"]},
{"a": "Jeanne attrape Bebo-souris et le met dans sa poche, fière de sa victoire.", "p": [4, 5, "Jeanne"]},
{"E": "Jeanne sort triomphante du bar, sachant qu'elle a montré sa force à tous les clients présents."}]
Exemple plus long:
      ${prompt}`,
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