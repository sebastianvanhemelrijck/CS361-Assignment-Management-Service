import express from "express"

import Assignment from "../models/assignment.js"

const router = express.Router()

// create an assignment for the caller
router.post("/", async (request, response) => {
  try {
    const assignment = await Assignment.create(request.body)

    response.status(201).json(assignment)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})


// get only the assignments for this caller
router.get("/user/:userId", async (request, response) => {
  try {
    const assignments = await Assignment.find({
      userId: request.params.userId,
    })

    response.json(assignments)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})


// update the matching assignment if it exists
router.put("/:id", async (request, response) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      request.params.id,
      request.body,
      { returnDocument: "after", runValidators: true }
    )

    if (!assignment) {
      return response.status(404).json({
        error: "Assignment not found",
      })
    }

    response.json(assignment)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})


// delete the matching assignment if it exists
router.delete("/:id", async (request, response) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(
      request.params.id
    )

    if (!assignment) {
      return response.status(404).json({
        error: "Assignment not found",
      })
    }

    response.status(204).send()
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})


export default router
