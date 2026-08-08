import express from "express"
import cors from "cors"

import assignmentRoutes from "../routes/assignments.js"

export function createApp() {
    const app = express()

    app.use(cors())
    app.use(express.json())

    app.get("/health", (req, res) => {
        res.json({
            status: "Assignment service running"
        })
    })

    app.use("/assignments", assignmentRoutes)

    return app
}