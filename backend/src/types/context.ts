import { IUser } from '../models';

export interface Context {
  token?: string;
  user?: IUser;
}