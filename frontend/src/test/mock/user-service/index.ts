import { InMemoryCreateUserService } from './user';
import { UserServiceRegistry } from './../../../app/authentication/authentication-model';


export const InMemoryUserService: UserServiceRegistry = {
  createUserService: new InMemoryCreateUserService(),
};
