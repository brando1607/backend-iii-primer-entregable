import { expect } from "chai";
import supertest from "supertest";
import { env } from "../utils/env.utils.js";

const requester = supertest(`http://localhost:${env.PORT}/api`);

describe("Tests for mocks routes", () => {
  it("Users are created", async () => {
    const response = await requester.get(`/mocks/users/${1}`);
    const { statusCode } = response;
    expect(statusCode).to.be.equals(201);
  });

  it("Users are returned", async () => {
    const response = await requester.get(`/mocks/users`);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Users' information is in an array", async () => {
    const response = await requester.get(`/mocks/users`);
    const { _body } = response;

    expect(_body).to.be.an("array");
  });

  it("Products are created", async () => {
    const response = await requester.get(`/mocks/products/${1}`);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(201);
  });

  it("Products are returned", async () => {
    const response = await requester.get(`/mocks/products`);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });
});
