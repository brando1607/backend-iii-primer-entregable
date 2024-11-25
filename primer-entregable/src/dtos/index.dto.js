import z from "zod";

export class GetDtos {
  static userDto = z.object({
    first_name: z.string({
      invalid_type_error: "Name should be a string",
      required_error: "Name is required",
    }),
    last_name: z.string({
      invalid_type_error: "Last name should be a string",
      required_error: "Last name is required",
    }),
    email: z
      .string({
        required_error: "email is required",
      })
      .email({ message: "Invalid email address" }),
    age: z.number({ required_error: "age is required" }),
    password: z.string({ required_error: "password is required" }),
    role: z
      .string({ invalid_type_error: "role must be a string" })
      .default("user")
      .optional(),
  });
  static productDto = z.object({
    name: z.string({
      invalid_type_error: "Name should be a string",
      required_error: "Name is required",
    }),
    price: z.number({
      invalid_type_error: "price has to be a number",
      required_error: "price is required",
    }),
    stock: z.number({
      invalid_type_error: "stock has to be a number",
      required_error: "stock is required",
    }),
  });
  static cartDto = z.object({
    products: z.array(
      z.object({
        _id: z.string({ required_error: "product's id is required" }),
        quantity: z.number({ required_error: "quantity is required" }),
      })
    ),
  });
}
export function validate(method) {
  return (req, res, next) => {
    const result = method.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }
    next();
  };
}

export function partialValidate(method) {
  return (req, res, next) => {
    const result = method.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }
    next();
  };
}

export function validation(obj) {
  return userDto.safeParse(obj);
}

export function validacionParcial(input) {
  return userDto.partial().safeParse(input);
}
