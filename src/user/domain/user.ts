import { Exclude } from 'class-transformer';

export class User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  @Exclude()
  password: string;
}
