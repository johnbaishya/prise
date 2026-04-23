
// error handler class to handle errors in the application and return appropriate status codes and messages
export default class AppError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}