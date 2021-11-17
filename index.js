const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nz5qt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

// client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// async function

async function run() {
  try {
    await client.connect();
    const database = client.db("luxury-cars");
    const carsCollection = database.collection("cars");

    // getting api
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // get single service

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carsCollection.findOne(query);
      res.json(car);
    });

    // post api
    app.post("/addCar", async (req, res) => {
      const newCar = req.body;
      const result = await carsCollection.insertOne(newCar);

      res.json(result);
    });

    // delete packages
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packageCollection.deleteOne(query);

      console.log("The following id is deleted", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

// run run function
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log("server running at ", port);
});
