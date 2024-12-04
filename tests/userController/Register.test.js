const { AuthJWT } = require("../../src/utils/auth");
const { Task } = require("../../src/models/Task");
const { User } = require("../../src/models/User");
const request = require("supertest");
const app = require("../../src/app");
const { default: conecction } = require("../../src/db");
const { faker } = require("@faker-js/faker");

describe("Users Register Controller", () => {
  describe("POST /register", () => {
    const usersData = [
      {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: undefined,
        confirmPassword: faker.internet.password(),
        message: '"password" is required',
      },
      {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        confirmPassword: undefined,
        message: '"confirmPassword" is required',
      },
      {
        name: faker.person.firstName(),
        email: undefined,
        password: faker.internet.password(),
        confirmPassword: faker.internet.password(),
        message: '"email" is required',
      },
      {
        name: undefined,
        email: faker.internet.email(),
        password: faker.internet.password(),
        confirmPassword: faker.internet.password(),
        message: '"name" is required',
      },
    ];

    beforeEach(async () => {});

    afterEach(async () => {
      try {
        await conecction.truncate({ cascade: true });
      } catch (error) {
        console.log({ error });
      }
    });

    it.each(usersData)(
      "should return error when has missing fields",
      async ({ name, email, password, confirmPassword, message }) => {
        try {
          const response = await request(app).post("/register").send({
            name,
            email,
            password,
            confirmPassword,
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

    it("should return error when has invalid password", async () => {
      try {
        const password = "123456";
        const response = await request(app).post("/register").send({
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: password,
          confirmPassword: password,
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "Validation error",
          error: expect.arrayContaining([
            expect.objectContaining({
              message: '"password" must be at least 8 characters long',
            }),
          ]),
        });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });

    it("should return error when password and confirmPassword are not the same", async () => {
      try {
        const response = await request(app).post("/register").send({
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          confirmPassword: faker.internet.password(),
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "Validation error",
          error: expect.arrayContaining([
            expect.objectContaining({
              message: '"confirmPassword" must be the same as "password"',
            }),
          ]),
        });
      } catch (error) {
        console.log({ error });
        throw error;
      }
    });

    it("should return error when email is already registered", async () => {
      try {
        const user = await User.create({
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        });

        const response = await request(app).post("/register").send({
          name: faker.person.firstName(),
          email: user.email,
          password: faker.internet.password(),
          confirmPassword: faker.internet.password(),
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: "Validation error",
          error: expect.arrayContaining([
            expect.objectContaining({
              message: '"email" has already been taken',
            }),
          ]),
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
