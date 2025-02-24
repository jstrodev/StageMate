const request = require("supertest");
const app = require("./server");

//
// Musician Endpoints
//
describe("Musician Endpoints", () => {
  describe("GET /api/musicians/all", () => {
    it("should respond with 200 and return an array of musicians", async () => {
      const response = await request(app).get("/api/musicians/all");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/musicians/register", () => {
    it("should register a new musician and return the created musician object", async () => {
      const newMusician = { name: "John Doe", instrument: "Guitar", genre: "Rock" };
      const response = await request(app)
        .post("/api/musicians/register")
        .send(newMusician);
      expect(response.statusCode).toBe(201); // assuming 201 Created
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newMusician.name);
    });
  });
});

//
// User Endpoints
//
describe("User Endpoints", () => {
  let testUserId;
  let token;

  describe("POST /api/users/register", () => {
    it("should register a new user and return the created user object", async () => {
      const newUser = { username: "testUser", password: "password123" };
      const response = await request(app)
        .post("/api/users/register")
        .send(newUser);
      expect(response.statusCode).toBe(201); // assuming 201 Created
      expect(response.body).toHaveProperty("id");
      testUserId = response.body.id;
    });
  });

  describe("POST /api/users/login", () => {
    it("should log in a user with valid credentials", async () => {
      const credentials = { username: "testUser", password: "password123" };
      const response = await request(app)
        .post("/api/users/login")
        .send(credentials);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
      token = response.body.token;
    });

    it("should fail to log in with invalid credentials", async () => {
      const credentials = { username: "testUser", password: "wrongPassword" };
      const response = await request(app)
        .post("/api/users/login")
        .send(credentials);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/users/aboutMe", () => {
    it("should return the details of the logged in user", async () => {
      const response = await request(app)
        .get("/api/users/aboutMe")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe("testUser");
    });
  });

  describe("GET /api/users/all", () => {
    it("should return an array of all users", async () => {
      const response = await request(app)
        .get("/api/users/all")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return the user details for the given id", async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("username");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update the user details", async () => {
      const updatedData = { username: "updatedUser" };
      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData);
      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe(updatedData.username);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete the user and return a success message", async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/deleted/i);
    });
  });

  describe("User Logout Endpoints", () => {
    // Testing both GET and POST logout routes if both exist.
    describe("GET /api/users/logout", () => {
      it("should log out the user", async () => {
        const response = await request(app)
          .get("/api/users/logout")
          .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toMatch(/logged out/i);
      });
    });

    describe("POST /api/users/logout", () => {
      it("should log out the user", async () => {
        const response = await request(app)
          .post("/api/users/logout")
          .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toMatch(/logged out/i);
      });
    });
  });
});

//
// Prospect Endpoints
//
describe("Prospect Endpoints", () => {
  describe("POST /api/prospects/add", () => {
    it("should add a new prospect and return the created prospect object", async () => {
      const newProspect = { name: "Jane Smith", email: "jane@example.com" };
      const response = await request(app)
        .post("/api/prospects/add")
        .send(newProspect);
      expect(response.statusCode).toBe(201); // assuming 201 Created
      expect(response.body).toHaveProperty("id");
    });
  });
});

//
// General Endpoints
//
describe("General Endpoints", () => {
  describe("GET /health", () => {
    it("should respond with 200 OK and a status message", async () => {
      const response = await request(app).get("/health");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status");
    });
  });

  describe("GET /api/test", () => {
    it("should respond with 200 OK", async () => {
      const response = await request(app).get("/api/test");
      expect(response.statusCode).toBe(200);
      // Optionally, add further expectations based on the endpoint's purpose
    });
  });
});
