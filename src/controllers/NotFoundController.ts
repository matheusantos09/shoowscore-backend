import { Request, Response } from 'express';

import { ERRORS_DEFAULT_3 } from '../langs/errors';

class NotFoundController {
  async notFound(req: Request, res: Response): Promise<Response> {
    return res.status(ERRORS_DEFAULT_3.http).json({
      status_code: ERRORS_DEFAULT_3.http,
      message: ERRORS_DEFAULT_3.message,
    });
  }
}

export default new NotFoundController();
