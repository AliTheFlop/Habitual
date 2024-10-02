import express from "express";

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
