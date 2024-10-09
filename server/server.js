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


    TODO: 
      Check if req.body has anything before putting, posting or patching. 
*/

//Get ALL Tasks at once
app.get("/api/tasks/daily", async (req, res) => {
  try {
    const result = await db
      .collection("tasks")
      .find({ type: "Daily" })
      .toArray();
    res.json(result);
  } catch (e) {
    res.json("An Error Has Occured: " + e);
  }
});

//Get specific task
app.get("/api/tasks/daily/:taskID", async (req, res) => {
  const { taskID } = req.params;
  console.log(taskID);

  // Check if ID is valid
  if (!ObjectId.isValid(taskID)) {
    res.status(400).json({ error: "Invalid task ID format" });
  }

  // Try to find task & send result
  try {
    const result = await tasks.findOne({
      $and: [{ _id: new ObjectId(taskID) }, { type: "Daily" }],
    });

    if (!result) {
      res.status(404).json({ error: "Task not found." });
    } else {
      res.json(result);
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//Insert a task (through the add task component)
// This post NEEDS a name, habitual and complete variable put into it
app.post("/api/tasks/daily", async (req, res) => {
  let { name, habitual, complete } = req.body;
  let insertData = {
    name: name,
    type: "Daily",
    habitual: habitual,
    weight: 0,
    complete: complete,
  };

  try {
    await tasks.insertOne(insertData);
    res.json({ Success: insertData });
  } catch (e) {
    res.json({ error: e });
  }
});

//Fix up a task
app.patch("/api/tasks/daily/:taskID", async (req, res) => {
  const { taskID } = req.params;
  const updates = req.body;

  //Check if ID in right format
  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  // PATCH SINGLE TASK
  try {
    const result = await tasks.updateOne(
      { $and: [{ _id: new ObjectId(taskID) }, { type: "Daily" }] },
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

// Change an entire document
app.put("/api/tasks/daily/:taskID", async (req, res) => {
  const { taskID } = req.params;
  const { name, habitual } = req.body;

  const newTask = {
    name: name || "No Name Provided",
    type: "Daily",
    habitual: habitual,
    weight: 0,
    complete: false,
  };

  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  try {
    const result = await tasks.replaceOne(
      { $and: [{ _id: new ObjectId(taskID) }, { type: "Daily" }] },
      { ...newTask },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return res.status(400).json({ error: "Task not found." });
    }

    res.json({ Success: "Task replaced successfully." });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

//Delete a specific daily task
app.delete("/api/tasks/daily/:taskID", async (req, res) => {
  const { taskID } = req.params;

  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const result = await tasks.deleteOne({
      $and: [{ _id: new ObjectId(taskID) }, { type: "Daily" }],
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ Success: "Task deleted successfully" });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//////////////////////////////////////////////////////////////////////////

// Weekly Get x2

app.get("/api/tasks/weekly", async (req, res) => {
  try {
    const result = await tasks.find({ type: "Weekly" }).toArray();

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

app.get("/api/tasks/weekly/:taskID", async (req, res) => {
  const { taskID } = req.params;

  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const result = await tasks
      .findOne({ $and: [{ _id: new ObjectId(taskID) }, { type: "Weekly" }] })
      .toArray();

    if (!result) {
      return res.status(400).json({ error: "Task not found." });
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// Weekly Post

app.post("/api/tasks/weekly", async (req, res) => {
  let { name, weight } = req.body;
  let insertData = {
    name: name,
    type: "Weekly",
    habitual: false,
    weight: weight,
    complete: false,
  };

  try {
    await tasks.insertOne(insertData);
    res.json({ Success: insertData });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// Weekly Put

app.put("/api/tasks/weekly/:taskID", async (req, res) => {
  const { taskID } = req.params;
  const { name, weight } = req.body;

  const newTask = {
    name: name || "No Name Provided!",
    type: "Weekly",
    habitual: false,
    weight: weight,
    complete: false,
  };

  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  try {
    const result = await tasks.replaceOne(
      { $and: [{ _id: new ObjectId(taskID) }, { type: "Weekly" }] },
      { ...newTask },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return res.status(400).json({ error: "Task not found." });
    }

    res.json({ Success: "Task replaced successfully." });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

// Weekly Patch

app.patch("/api/tasks/weekly/:taskID", async (req, res) => {
  const { taskID } = req.params;
  const updates = req.body;

  //Check if ID in right format
  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  // PATCH SINGLE TASK
  try {
    const result = await tasks.updateOne(
      { $and: [{ _id: new ObjectId(taskID) }, { type: "Weekly" }] },
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

// Weekly Delete

app.delete("/api/tasks/weekly/:taskID", async (req, res) => {
  const { taskID } = req.params;

  if (!ObjectId.isValid(taskID)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const result = await tasks.deleteOne({
      $and: [{ _id: new ObjectId(taskID) }, { type: "Weekly" }],
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ Success: "Task deleted successfully" });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//////////////////////////////////////////////////////////////////////////

// TODO: GOALS

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
