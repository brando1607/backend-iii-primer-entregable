import { expect } from "chai";
import supertest from "supertest";
import { env } from "../utils/env.utils.js";

const requester = supertest(`http://localhost:${env.PORT}/api`);

describe("Test for cart routes", () => {
  const data = {
    first_name: "brando",
    last_name: "hernandez",
    email: "bhernandez@coder.com",
    age: 30,
    password: "hola",
    role: "admin",
  };

  const temporaryProduct = {
    name: "sofa",
    price: 110,
    stock: 10,
  };

  let uid;
  let cid;
  let cookie;
  let pid;
  let sampleProduct;

  let loginObject = {
    email: "bhernandez@coder.com",
    password: "hola",
  };

  it("Create sample user", async () => {
    const response = await requester.post("/auth/register").send(data);
    const getCookie = await requester.post(`/auth/login`).send(loginObject);
    const { _body, statusCode } = response;

    cookie = getCookie.headers["set-cookie"];
    uid = _body.user._id;
    cid = _body.user.cart;

    expect(statusCode).to.be.equals(201);
  });

  it("Create sample product", async () => {
    const response = await requester
      .post("/products/create-product")
      .set("Cookie", cookie)
      .send(temporaryProduct);

    const { statusCode, _body } = response;
    pid = _body.result._id;

    sampleProduct = { id: pid, amount: 3 };

    expect(statusCode).to.be.equals(200);
  });

  it("Cart is deleted", async () => {
    const response = await requester.delete(`/cart/delete/${cid}`);

    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Cart is created", async () => {
    const response = await requester.get(`/cart/create`).set("Cookie", cookie);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Get cart by id", async () => {
    const response = await requester.get(`/cart/${cid}`);

    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Add product to cart", async () => {
    const response = await requester
      .post("/cart/add-to-cart")
      .send(sampleProduct)
      .set("Cookie", cookie);

    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Remove product from cart", async () => {
    const response = await requester.delete(
      `/cart/${pid}/${2}/${cid}/remove-product`
    );
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Complete purchase for product", async () => {
    const response = await requester.post(`/cart/${cid}/purchase`);

    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Delete sample product", async () => {
    const response = await requester
      .delete(`/products/delete/${pid}`)
      .set("Cookie", cookie);

    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });

  it("Delete sample user", async () => {
    const response = await requester.delete(`/user/delete/${uid}`);
    const { statusCode } = response;

    expect(statusCode).to.be.equals(200);
  });
});
