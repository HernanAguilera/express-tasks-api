const { AuthJWT } = require("../../utils/auth");
const { Task } = require("../../models/Task");
const { User } = require("../../models/User");
const request = require("supertest");
const app = require("../../app");
const { default: conecction } = require("../../db");
const { faker } = require("@faker-js/faker");

describe("Tasks List Controller", () => {
  describe("GET /api/tasks", () => {
    beforeEach(async () => {
      conecction.truncate({ cascade: true });
    });

    it("should not return tasks without authorization", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(401);
    });

    it("should return empty tasks when no tasks exist", async () => {
      const authJWT = new AuthJWT();
      const user = await User.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      const token = authJWT.generateToken({
        userId: user.id,
      });
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all tasks", async () => {
      const authJWT = new AuthJWT();
      const user = await User.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      const token = authJWT.generateToken({
        userId: user.id,
      });
      const task = await Task.create({
        name: faker.lorem.sentence(3),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["pending", "completed", "failed"]),
        userId: user.id,
      });
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: task.id,
          name: task.name,
          description: task.description,
          status: task.status,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          userId: user.id,
        },
      ]);
    });
  });
});
