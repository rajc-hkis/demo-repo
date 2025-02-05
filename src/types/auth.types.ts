import { User } from '@prisma/client';
import { IResponseBody } from './common.types';

export interface IRegisterUser {
  email: string;
  password: string;
  name: string;
  inviteCode?: string;
}

export interface IRegisterUserResponse extends IResponseBody {
  user: User | null;
}
