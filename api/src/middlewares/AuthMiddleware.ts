import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
interface IPayload {
	sub: string
}
class AuthMiddleware {
  auth(request: Request, response: Response, next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      response.status(401).json({
        code: 'token is missing',
        message: 'Token is missing',
      });
      return;
    }

    const [, token] = authHeader.split(' ');

    const secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;

    if (!secretKey) {
      throw new Error('There is no token key');
    }

    try {
      const { sub } = verify(token, secretKey) as IPayload;
      request.user_id = sub;
      next();
    } catch (error) {
      response.status(401).json({
        code: 'token missing or invalid',
        message: 'Token expired.',
      });
    }
  }
}

export { AuthMiddleware }
