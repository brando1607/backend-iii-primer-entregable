import { expect } from "chai";
import supertest from "supertest";
import { env } from "../utils/env.utils.js";

const requester = supertest(`http://localhost:${env.PORT}/api`);

describe("Test for products routes", () => {
  let cookie;

  let pid;

  let loginObject = {
    email: "brando@gmail.com",
    password: "hola",
  };

  const data = {
    name: "sofa",
    price: 110,
    stock: 10,
  };

  let updateObject = {
    stock: 5,
  };

  it("Product is created", async () => {
    //cookie is required to add a product
    const getCookie = await requester.post(`/auth/login`).send(loginObject);
    cookie = getCookie.headers["set-cookie"];

    const response = await requester
      .post("/products/create-product")
      .set("Cookie", cookie)
      .send(data);

    const { statusCode, _body } = response;
    pid = _body.result._id;

    expect(statusCode).to.be.equals(200);
  });

  it("Product is returned by id", async () => {
    const response = await requester.get(`/products/${pid}`);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Product is updated", async () => {
    let response = await requester
      .put(`/products/update/${pid}`)
      .send(updateObject);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Products are returned in a array", async () => {
    const response = await requester.get("/products/getAllProducts");
    const { _body } = response;

    expect(_body).to.be.an("array");
  });

  it("All the products are returned", async () => {
    const response = await requester.get("/products/getAllProducts");
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Product is deleted", async () => {
    const response = await requester
      .delete(`/products/delete/${pid}`)
      .set("Cookie", cookie);

    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });
});
