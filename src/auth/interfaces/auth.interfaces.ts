import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ROLES } from 'src/constants/roles';

export interface PayloadToken {
  UserId: string;
  role: ROLES[];
}
export interface AuthTokenResult extends JwtPayload {
  role: ROLES[];
  UserId: string;
}

export interface UseToken {
  exExpired: boolean;
  userid: string;
  role: ROLES[];
}

export interface ContextGraphql {
  req: Request;
  roles: string[];
  userid: string;
}
