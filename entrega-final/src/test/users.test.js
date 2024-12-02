import { expect } from "chai";
import supertest from "supertest";
import { env } from "../utils/env.utils.js";

const requester = supertest(`http://localhost:${env.PORT}/api`);

describe("Tests for user routes", () => {
  const data = {
    first_name: "brando",
    last_name: "hernandez",
    email: "leslies@gmail.com",
    age: 30,
    password: "hola",
    role: "user",
  };

  let updateObject = { email: "chau1234@gmail.com" };

  let loginObject = {
    email: "brando@gmail.com",
    password: "hola",
  };

  let uid;

  let cookie;

  it("User is created", async () => {
    const response = await requester.post("/auth/register").send(data);
    const { _body, statusCode } = response;
    uid = _body.user._id;

    expect(statusCode).to.be.equals(201);
  });

  it("User is returned by id", async () => {
    const response = await requester.get(`/user/getOneUser/${uid}`);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("All user are retrieved", async () => {
    const response = await requester.get("/user/getAllUsers");
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Users are returned in a array", async () => {
    const response = await requester.get("/user/getAllUsers");
    const { _body } = response;

    expect(_body).to.be.an("array");
  });

  it("User is logged in", async () => {
    const response = await requester.post(`/auth/login`).send(loginObject);
    cookie = response.headers["set-cookie"];
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("User is updated", async () => {
    const response = await requester
      .put(`/user/${uid}`)
      .send(updateObject)
      .set("Cookie", cookie);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("User's information is returned", async () => {
    const response = await requester.get(`/auth/current`).set("Cookie", cookie);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("User's information is returned in an object", async () => {
    const response = await requester.get(`/auth/current`).set("Cookie", cookie);
    const { _body } = response;

    expect(_body.user).to.be.an("object");
  });

  it("User is logged out", async () => {
    const response = await requester.get(`/user/logout`).set("Cookie", cookie);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("User is deleted", async () => {
    const response = await requester.delete(`/user/delete/${uid}`);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });
});
