const { AuthJWT } = require("../../src/utils/auth");
const { Task } = require("../../src/models/Task");
const { User } = require("../../src/models/User");
const request = require("supertest");
const app = require("../../src/app");
const { default: conecction } = require("../../src/db");
const { faker } = require("@faker-js/faker");

describe("Users Login Controller", () => {
  describe("POST /login", () => {
    let user = null;
    const usersData = [
      {
        email: faker.internet.email(),
        password: undefined,
        message: '"password" is required',
      },
      {
        email: undefined,
        password: faker.internet.password(),
        message: '"email" is required',
      },
    ];

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

    it.each(usersData)(
      "should return error when has missing fields",
      async ({ email, password, message }) => {
        try {
          const response = await request(app).post("/login").send({
            email,
            password,
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

    it("should return error when password is incorrect", async () => {
      try {
        const response = await request(app).post("/login").send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          message: "Usuario no encontrado",
        });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });

    it("should return users when has valid data", async () => {
      try {
        const password = faker.internet.password();
        const userData = {
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: password,
          confirmPassword: password,
        };
        const response = await request(app).post("/register").send(userData);

        console.log({ response: response.body.error });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          name: userData.name,
          email: userData.email,
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
