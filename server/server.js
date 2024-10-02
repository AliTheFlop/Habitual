import express from "express";

const app = express();
const port = 3000;

// HABIT TASKS: Get, Post, Patch Delete
// WEEKLY TASKS: Get, Post, Patch, Delete
// BIG GOAL: Get, Post, Patch, Delete

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
