# Assignment Management Service

MS6 is a reusable service for creating and managing assignments or tasks from
different Main Programs. Elliott's Express and MongoDB implementation is the
main service in this repository.

## Communication contract

The service uses a REST API with JSON at `http://127.0.0.1:5003` by default.

| Method and path | Purpose |
| --- | --- |
| `GET /health` | Check whether the service is running |
| `POST /assignments` | Create an assignment or task |
| `GET /assignments/user/{userId}` | View assignments for one Main Program or user |
| `PUT /assignments/{id}` | Edit details or change completion state |
| `DELETE /assignments/{id}` | Remove an assignment |

Create requests require `userId`, `title`, and `dueDate`. Optional fields are
`description` and `completed`. Each Main Program chooses a stable `userId` for
its own assignments. For example, PrepTrack uses `PrepTrack`, while a Study
Planner or Habit Tracker can use its own program or user identifier without
changing the service.

## Sprint 3 stories

- Create and view an assignment or task.
- Edit, complete, or delete an existing assignment or task.

## Setup

Install the project dependencies:

```powershell
npm install
```

## Running the service

For a demonstration without installing MongoDB, run:

```powershell
npm run demo-service
```

This starts a temporary MongoDB database and serves the API at
`http://127.0.0.1:5003`.

## Normal mode

The service can also connect to MongoDB through the `MONGODB_URI` environment
variable. Copy `.env.example` to `.env`, replace the placeholder URI, and run:

```powershell
npm start
```

## Testing

The tests use MongoMemoryServer, so a permanent database is not needed:

```powershell
npm test
```

The current tests cover the health check and creating, viewing, updating, and
deleting assignments.

## Remaining shared work

Filtering, pagination, bulk updates, duplicate rules, and larger usability tests
remain available for shared follow-up work.
