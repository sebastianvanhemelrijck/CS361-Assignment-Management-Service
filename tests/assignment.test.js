import assert from "node:assert/strict"
import { after, before, beforeEach, test } from "node:test"

import { MongoMemoryServer } from "mongodb-memory-server"
import request from "supertest"

import { createApp } from "../src/app.js"
import { connectDatabase, disconnectDatabase } from "../src/db.js"
import Assignment from "../models/assignment.js"

let database
let databaseUri
let app

before(async () => {
    database = await MongoMemoryServer.create()

    databaseUri = database.getUri("assignment_service_test")
    await connectDatabase(databaseUri)

    app = createApp()
})

beforeEach(async () => {
    await Assignment.deleteMany({})
})

after(async () => {
    await disconnectDatabase()
    await database.stop()
})

test("health returns service status", async () => {
    const response = await request(app).get("/health")

    assert.equal(response.status, 200)
    assert.equal(response.body.status, "Assignment service running")
})

test("creates an assignment", async () => {
    const response = await request(app)
        .post("/assignments")
        .send({
            userId: "user123",
            title: "CS361 Project",
            description: "Finish microservice",
            dueDate: "2026-08-10"
        })

    assert.equal(response.status, 201)
    assert.equal(response.body.userId, "user123")
    assert.equal(response.body.title, "CS361 Project")
})

test("gets assignments for a user", async () => {
    await request(app)
        .post("/assignments")
        .send({
            userId: "user123",
            title: "Assignment 1",
            dueDate: "2026-08-10"
        })

    const response = await request(app)
        .get("/assignments/user/user123")

    assert.equal(response.status, 200)
    assert.equal(response.body.length, 1)
    assert.equal(response.body[0].title, "Assignment 1")
})

test("updates an assignment", async () => {
    const created = await request(app)
        .post("/assignments")
        .send({
            userId: "user123",
            title: "Old title",
            dueDate: "2026-08-10"
        })

    const response = await request(app)
        .put(`/assignments/${created.body._id}`)
        .send({
            title: "New title"
        })

    assert.equal(response.status, 200)
    assert.equal(response.body.title, "New title")
})

test("marks an assignment complete", async () => {
    const created = await request(app)
        .post("/assignments")
        .send({
            userId: "user123",
            title: "Finish checklist",
            dueDate: "2026-08-10"
        })

    const response = await request(app)
        .put(`/assignments/${created.body._id}`)
        .send({ completed: true })

    assert.equal(response.status, 200)
    assert.equal(response.body.completed, true)
})

test("rejects an invalid assignment update", async () => {
    const created = await request(app)
        .post("/assignments")
        .send({
            userId: "user123",
            title: "Valid title",
            dueDate: "2026-08-10"
        })

    const response = await request(app)
        .put(`/assignments/${created.body._id}`)
        .send({ title: "" })

    assert.equal(response.status, 400)
    assert.match(response.body.error, /title/i)
})

test("saved assignments remain after reconnecting", async () => {
    await request(app)
        .post("/assignments")
        .send({
            userId: "persistent-user",
            title: "Keep this task",
            dueDate: "2026-08-10"
        })

    await disconnectDatabase()
    await connectDatabase(databaseUri)

    const response = await request(app)
        .get("/assignments/user/persistent-user")

    assert.equal(response.status, 200)
    assert.equal(response.body.length, 1)
    assert.equal(response.body[0].title, "Keep this task")
})

test("deletes an assignment", async () => {
    const created = await request(app)
        .post("/assignments")
        .send({
            userId: "user123",
            title: "Delete me",
            dueDate: "2026-08-10"
        })

    const response = await request(app)
        .delete(`/assignments/${created.body._id}`)

    assert.equal(response.status, 204)
})
