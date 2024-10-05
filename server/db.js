import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("Habitual");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
    throw e;
  }
}

export default connectToDatabase;
