export const errors = {
  error: {
    clientError: { message: "Client Error", statusCode: 400 },
    registrationError: { message: "Client Error", statusCode: 400 },
    wrongUserId: { message: "Id not 24 characters long", statusCode: 400 },
    changeNotAllowed: {
      message: "User's id or cart can't be changed",
      statucCode: 400,
    },
    empty: { message: "Request sent empty", statusCode: 400 },
  },
  auth: { message: "Invalid Credentials", statusCode: 401 },
  forbidden: { message: "Forbidden Action", statusCode: 403 },
  notFound: { message: "Not Found", statusCode: 404 },
  fatal: { message: "Server Error", statusCode: 500 },
  noContent: { message: "No content yet", statusCode: 204 },
};
