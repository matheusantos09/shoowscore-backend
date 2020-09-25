import LogConsults from "../schemas/LogConsults";
import LogExceptionsAndErrors from "../schemas/LogExceptionsAndErrors";

class LogController {

  async api ( message: string, resource: string ) {
    LogConsults.create({
      message,
      resource
    })
  }

  async exception ( status_code: number, app_code: number, message: string, resource: string ) {
    LogExceptionsAndErrors.create({
      status_code,
      app_code,
      message,
      resource
    })
  }

}

export default new LogController()