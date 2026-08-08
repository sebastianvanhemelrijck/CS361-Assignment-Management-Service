import { MongoMemoryServer } from "mongodb-memory-server"

const port = "5003"

process.env.PORT ||= port

const database = await MongoMemoryServer.create()
process.env.MONGODB_URI = database.getUri("cs361_assignments")

console.log("Temporary demo database started.")

await import("./server.js")

async function stop() {
    await database.stop()
    process.exit(0)
}

process.on("SIGINT", stop)
process.on("SIGTERM", stop)