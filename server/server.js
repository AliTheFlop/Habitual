import express from "express";
import cors from "cors";
import connectToDatabase from "./db.js";
import { ObjectId } from "mongodb";

const app = express();
const port = 3000;

const db = await connectToDatabase();
const tasks = db.collection("tasks");

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/*

Endpoints:
  GET /api/tasks/daily -> Gets daily tasks
  POST /api/tasks/daily -> Insert daily task(s)
  PATCH /api/tasks/daily/:taskID -> Change a daily task
  DELETE /api/tasks/daily/:taskID -> Delete a daily task

  GET /api/tasks/weekly -> Gets weekly tasks
  POST /api/tasks/weekly -> Insert weekly task(s)
  PATCH /api/tasks/weekly/:taskID -> Change a weekly task (Includes task & weight)
  DELETE /api/tasks/weekly/:taskID -> Delete a weekly task

  GET /api/goals -> Gets goals
  GET /api/goals/:year -> Gets goal for specific year (after a patch request, perhaps)
  POST /api/goals/:year -> Inserts a goal for the specific year OR adds a year
  PATCH /api/goals/:year -> Changes a goal for the specific year
  DELETE /api/goals/:year -> Deletes a year from the goals

*/

/*

TODO:

- RESTful Weekly & Goals
- Fix up DELETE Daily -> Error when task doesn't exist
- Daily Goals -> Put Request

*/

//Get ALL Tasks at once
app.get("/api/tasks/daily", async (req, res) => {
  try {
    const result = await db.collection("tasks").find().toArray();
    res.json(result);
  } catch (e) {
    res.json("An Error Has Occured: " + e);
  }
});

//Get specific task
app.get("/api/tasks/daily/:taskID", async (req, res) => {
  const { taskID } = req.params;
  console.log(taskID);
  try {
    const result = await tasks.find({ _id: new ObjectId(taskID) }).toArray();
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//Insert a task (through the add task component)
// This post NEEDS a name, habitual and complete variable put into it
app.post("/api/tasks/daily", async (req, res) => {
  console.log(req.body);
  let { name, habitual, complete } = req.body;
  let insertData = {
    name: name,
    info: {
      type: "Daily",
      habitual: habitual,
    },
    weight: 0,
    complete: complete,
  };

  try {
    await tasks.insertOne(insertData);
    res.json({ Success: insertData });
  } catch (e) {
    console.error(e);
    res.json({ Error: e });
  }
});

//Fix up a task
app.patch("/api/tasks/daily/:taskID", async (req, res) => {
  console.log(req.body);
  console.log(req.params.taskID);
  const { taskID } = req.params;
  const updates = req.body;

  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const result = await tasks.updateOne(
      { _id: new ObjectId(taskID) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: "Task updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
  }
});

//Delete a specific daily task
app.delete("/api/tasks/daily/:taskID", async (req, res) => {
  const { taskID } = req.params;
  console.log("Delete request for: ", taskID);

  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const result = await tasks.deleteOne({ _id: new ObjectId(taskID) });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ Success: "Task deleted successfully" });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
