// Name: Elliott and Sebastian Van Hemelrijck Noya
// Course: CS361 - Software Engineering 1
// Assignment: Assignment 9
// Due Date: 8/10/26
// Description: Live request and response test for the assignment REST API

const baseUrl = (process.env.ASSIGNMENT_SERVICE_URL || "http://127.0.0.1:5003")
  .replace(/\/$/, "")

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options)
  const data = response.status === 204
    ? null
    : await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data?.error || `HTTP ${response.status}`
    throw new Error(`${path} failed: ${message}`)
  }

  return data
}

async function run() {
  const userId = `Assignment9Demo-${Date.now()}`
  let assignmentId

  try {
    const health = await request("/health")
    console.log("Health response:", health)

    const created = await request("/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        title: "Finish readiness checklist",
        description: "Review the saved kit items",
        dueDate: "2026-08-10",
      }),
    })
    assignmentId = created._id
    console.log("Create response:", created)

    const listed = await request(`/assignments/user/${encodeURIComponent(userId)}`)
    if (listed.length !== 1 || listed[0]._id !== assignmentId) {
      throw new Error("The created assignment was not returned by the list request.")
    }
    console.log("List response:", listed)

    const completed = await request(`/assignments/${assignmentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    })
    if (!completed.completed) {
      throw new Error("The assignment was not marked complete.")
    }
    console.log("Update response:", completed)
  } finally {
    if (assignmentId) {
      await request(`/assignments/${assignmentId}`, { method: "DELETE" })
      console.log("Delete response: assignment removed")
    }
  }

  console.log("Assignment service live test passed.")
}

run().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
