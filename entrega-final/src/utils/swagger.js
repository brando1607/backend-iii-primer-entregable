import { __dirname } from "../utils.js";

export const opts = {
  definition: {
    openapi: "3.1.1",
    info: {
      title: "CODER COMMERCE",
      description: "CODER COMMERCE API'S DOCUMENTATION",
    },
  },
  apis: [`${__dirname}/docs/*.yaml`],
};
