import mongoose from "mongoose"

export async function connectDatabase(uri) {
    if (!uri) {
        throw new Error("MONGODB_URI is required")
        //console.log("No MONGODB_URI provided. Skipping database connection. Connect to Database later")
        //return
    }

    await mongoose.connect(uri)

    console.log("Connected to MongoDB")
}

export async function disconnectDatabase() {
    await mongoose.disconnect()
}