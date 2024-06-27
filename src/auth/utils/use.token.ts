import * as jwt from 'jsonwebtoken';
import { AuthTokenResult, UseToken } from '../interfaces/auth.interfaces';
export const useToken = (token: string): UseToken => {
  try {
    const decode = jwt.decode(token) as AuthTokenResult;

    const currentDate = new Date();
    const expiresDate = new Date(decode.exp);
    const exExpired = +expiresDate <= +currentDate / 1000;
    return {
      exExpired,
      userid: decode.UserId,
      role: decode.role,
    };
  } catch (Err) {}
};
