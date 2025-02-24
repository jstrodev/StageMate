const request = require("supertest");
const app = require("./server");

describe("GET /api/musicians/all", () => {
  it("responds with 200 OK and array of musicians", async () => {
    const response = await request(app).get("/api/musicians/all");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

//List of Endpoints

// /api/musicians/all
// /api/users/register
// /api/users/login
// /api/users/aboutMe
// /api/users/all
// /api/musicians/all
// /api/users/:id
// /api/users/logout
// /api/prospects/add
// /health
// /api/test
