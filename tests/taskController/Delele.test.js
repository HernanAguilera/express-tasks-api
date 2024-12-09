const { AuthJWT } = require("../../src/utils/auth");
const { Task } = require("../../src/models/Task");
const { User } = require("../../src/models/User");
const request = require("supertest");
const app = require("../../src/app");
const { default: conecction } = require("../../src/db");
const { faker } = require("@faker-js/faker");

describe("Tasks Delete Controller", () => {
  describe("DELETE /tasks", () => {
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
        status: faker.helpers.arrayElement(["pending", "completed", "in progress"]),
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
      const response = await request(app).delete(`/tasks/${task.id}`);

      expect(response.status).toBe(401);
    });

    it("should return error when try to delete a task that doesn't exist", async () => {
      try {
        const authJWT = new AuthJWT();
        const token = authJWT.generateToken({
          userId: user.id,
        });
        let fakeId = 0;
        let taskExist = false;
        do {
          fakeId = faker.number.int({ min: 1000, max: 2000 });
          taskExist = await Task.findByPk(fakeId);
        } while (taskExist);

        const response = await request(app)
          .delete(`/tasks/${fakeId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });

    it("should return ok when try to delete a task that exists", async () => {
      try {
        const authJWT = new AuthJWT();
        const token = authJWT.generateToken({
          userId: user.id,
        });
        const response = await request(app)
          .delete(`/tasks/${task.id}`)
          .set("Authorization", `Bearer ${token}`);

        console.log({ response: response.body });

        expect(response.status).toBe(200);
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });

    it("should return error when try to delete a task that owns another user", async () => {
      try {
        const authJWT = new AuthJWT();
        const token = authJWT.generateToken({
          userId: user.id,
        });
        const otherUser = await User.create({
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        await Task.update(
          {
            userId: otherUser.id,
          },
          {
            where: { id: task.id },
          }
        );
        const response = await request(app)
          .delete(`/tasks/${task.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });
  });
});
