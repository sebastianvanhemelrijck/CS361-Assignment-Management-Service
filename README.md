# Assignment Management Service

MS6 is a reusable service for creating and managing assignments or tasks from
different Main Programs.

## Planned communication

The service will use a REST API with JSON.

## Sprint 3 stories

- Create and view an assignment or task.
- Edit, complete, or delete an existing assignment or task.

## Status

The service currently supports creating, editting, viewing,
complete, or delete an assignment or task

## Setup

Install project dependencies

npm install

## Running the service

For demonstration purposes without installing the MongoDB database,
run:

npm run demo-service

This creates a temporary MongoDB database.

This service runs locally on port:

http://127.0.0.1:5003

## Normal Mode

The service can also connect to a MongoDB database using a MONGODB_URI
environment variable.

Create a .env file with:

PORT=5003
MONGODB_URI=your-mongodb-connection-string

Then run:

npm start


## Testing

The tests use MongoMemoryServer, so a permanent database is not needed

Run the test file with:

npm test

The current tests cover:
- Health check
- Creating an assignment
- Retrieving assignments for a user
- Updating an assignment
- Deleting an assignment
