const { AuthJWT } = require("../../src/utils/auth");
const { Task } = require("../../src/models/Task");
const { User } = require("../../src/models/User");
const request = require("supertest");
const app = require("../../src/app");
const { default: conecction } = require("../../src/db");
const { faker } = require("@faker-js/faker");

describe("Tasks Update Controller", () => {
  describe("PUT /tasks", () => {
    const tasksData = [
      {
        name: faker.lorem.sentence(3),
        description: undefined,
        status: faker.helpers.arrayElement(["pending", "in progress", "completed"]),
        message: '"description" is required',
      },
      {
        name: undefined,
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["pending", "in progress", "completed"]),
        message: '"name" is required',
      },
    ];
    let user = null;
    let task = null;

    beforeEach(async () => {
      user = await User.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      task = await Task.create({
        name: faker.lorem.sentence(3),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["pending", "completed", "deleted"]),
        userId: user.id,
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
      const response = await request(app).put(`/tasks/${task.id}`);

      expect(response.status).toBe(401);
    });

    it.each(tasksData)(
      "should return error when has missing fields",
      async ({ name, description, status, message }) => {
        try {
          const authJWT = new AuthJWT();
          const token = authJWT.generateToken({
            userId: user.id,
          });
          const response = await request(app)
            .put(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
              name,
              description,
              status,
            });

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            message: "Validation error",
            error: expect.arrayContaining([
              expect.objectContaining({
                message,
              }),
            ]),
          });
        } catch (error) {
          console.log({ error });
          throw error;
        }
      }
    );

    it("should return error when has invalid status", async () => {
      try {
        const authJWT = new AuthJWT();
        const token = authJWT.generateToken({
          userId: user.id,
        });
        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: faker.lorem.sentence(3),
            description: faker.lorem.sentence(),
            status: "invalid",
          });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "Validation error",
          error: expect.arrayContaining([
            expect.objectContaining({
              message: '"status" must be one of [pending, in progress, completed]',
            }),
          ]),
        });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });

    it("should return tasks when has valid data", async () => {
      try {
        const authJWT = new AuthJWT();
        const token = authJWT.generateToken({
          userId: user.id,
        });
        const taskData = {
          name: faker.lorem.sentence(3),
          description: faker.lorem.sentence(),
          status: faker.helpers.arrayElement([
            "pending",
            "in progress",
            "completed"
          ]),
        };
        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(taskData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          name: taskData.name,
          description: taskData.description,
          status: taskData.status,
          userId: user.id,
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
        });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });
  });
});
