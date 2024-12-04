export function authorization(role) {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .send({ message: "Please log in so you can be verified" });
    }

    if (!role.includes(user.role)) {
      return res
        .status(401)
        .json({ message: "you're not authorized to access this section" });
    }
    next();
  };
}
