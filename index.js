const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// mongo
const uri =
  "mongodb+srv://hyperCar:QJ7onvyGLU37GKPC@cluster0.nz5qt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// my process.env was creating problems, so set the original link instead

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

    const usersCollection = database.collection("users");

    const reviewsCollection = database.collection("reviews");

    // getting api
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // get single service

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const car = await carsCollection.findOne(query);
      res.json(car);
    });

    // post item add new car
    app.post("/addCar", async (req, res) => {
      const newCar = req.body;
      const result = await carsCollection.insertOne(newCar);
      res.json(result);
    });

    // update api update car
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCar = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          brand: updatedCar.brand,
          model: updatedCar.model,
          price: updatedCar.price,
          image: updatedCar.image,
        },
      };
      const result = await carsCollection.updateOne(filter, updateDoc, options);

      // console.log(id);
      res.json(result);
    });

    // review;

    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await reviewsCollection.insertOne(newReview);
      res.json(result);
    });

    app.put("/reviews", async (req, res) => {
      const review = req.body;
      const filter = { _id: ObjectId() };
      const options = { upsert: true };
      const updateDoc = {
        $set: review,
      };
      const result = await reviewsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // delete item
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.deleteOne(query);

      console.log("The following id is deleted", result);
      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
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
