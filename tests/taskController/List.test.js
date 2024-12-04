const { AuthJWT } = require("../../src/utils/auth");
const { Task } = require("../../src/models/Task");
const { User } = require("../../src/models/User");
const request = require("supertest");
const app = require("../../src/app");
const { default: conecction } = require("../../src/db");
const { faker } = require("@faker-js/faker");

describe("Tasks List Controller", () => {
  describe("GET /tasks", () => {
    const statusData = ["pending", "completed", "deleted"];
    let user = null;
    beforeEach(async () => {
      user = await User.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    });

    afterEach(async () => {
      try {
        await conecction.truncate({ cascade: true });
      } catch (error) {
        console.log({ error });
      }
    });

    it("should not return tasks without authorization", async () => {
      const response = await request(app).get("/tasks");

      expect(response.status).toBe(401);
    });

    it("should return empty tasks when no tasks exist", async () => {
      const authJWT = new AuthJWT();
      const token = authJWT.generateToken({
        userId: user.id,
      });
      const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all tasks", async () => {
      const authJWT = new AuthJWT();
      const token = authJWT.generateToken({
        userId: user.id,
      });
      const NumberOfTasks = faker.number.int({ min: 1, max: 10 });
      for (let i = 0; i < NumberOfTasks; i++) {
        await Task.create({
          name: faker.lorem.sentence(3),
          description: faker.lorem.sentence(),
          status: faker.helpers.arrayElement([
            "pending",
            "completed",
            "failed",
          ]),
          userId: user.id,
        });
      }
      const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(NumberOfTasks);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            status: expect.any(String),
            userId: expect.any(Number),
            updatedAt: expect.any(String),
            createdAt: expect.any(String),
          }),
        ])
      );
    });

    it.each(statusData)(
      "should return tasks with status when status is %s",
      async (status) => {
        const authJWT = new AuthJWT();
        const token = authJWT.generateToken({
          userId: user.id,
        });
        const NumberOfTasks = faker.number.int({ min: 0, max: 10 });
        for (let i = 0; i < NumberOfTasks; i++) {
          await Task.create({
            name: faker.lorem.sentence(3),
            description: faker.lorem.sentence(),
            status,
            userId: user.id,
          });
        }
        for (let i = 0; i < faker.number.int({ min: 0, max: 10 }); i++) {
          await Task.create({
            name: faker.lorem.sentence(3),
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(
              statusData.filter((s) => s !== status)
            ),
            userId: user.id,
          });
        }
        const response = await request(app)
          .get(`/tasks?status=${status}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(NumberOfTasks);
      }
    );
  });
});
