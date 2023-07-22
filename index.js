const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

///////////////Connection to DataBase///////////////
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nekc4yh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    database = client.db("CollegeDB");
    collegeCollection = database.collection("College");
    admissionCollection = database.collection("Admission");

    app.get("/api/colleges", async (req, res) => {
      try {
        const colleges = await collegeCollection.find({}).toArray();
        res.send(colleges);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        res.status(500).json({ error: "Failed to fetch colleges" });
      }
    });

    // API Endpoint to Get All Admission Records
    app.get("/api/admissions", async (req, res) => {
      try {
        const admissions = await admissionCollection.find({}).toArray();
        res.send(admissions);
      } catch (error) {
        console.error("Error fetching admission records:", error);
        res.status(500).json({ error: "Failed to fetch admission records" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//////////////////////////////

app.get("/", (req, res) => {
  res.send("College server is running");
});
app.listen(port, () => {
  console.log(`College server is running on port ${port}`);
});
