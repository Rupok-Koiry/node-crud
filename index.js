const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0oeh2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("mern_DB");
    const userCollection = database.collection("users");

    app.get("/", async (req, res) => {
      res.send("<h2>App Running</h2>");
    });

    //GET API
    app.get("/users", async (req, res) => {
      const result = await userCollection.find({});
      const users = await result.toArray();
      res.json(users);
    });

    app.get("/users/:_id", async (req, res) => {
      const result = await userCollection.findOne({
        _id: ObjectId(req.params._id),
      });

      res.json(result);
    });
    //POST API
    app.post("/users", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.json(result);
    });
    //PUT API
    app.patch("/users/:_id", async (req, res) => {
      const { name, email, phone, address } = req.body;
      const result = await userCollection.updateOne(
        {
          _id: ObjectId(req.body._id),
        },
        { $set: { name, email, phone, address } }
      );
      res.json({ name: "Rupok" });
    });
    //DELETE API
    app.delete("/users", async (req, res) => {
      const result = await userCollection.deleteOne({
        _id: ObjectId(req.body._id),
      });
      res.json(result);
    });
  } catch (err) {
    console.log(err.message);
  }
}
run().catch(console.dir);

app.listen(PORT, () => console.log(`listening to the port ${PORT}`));
