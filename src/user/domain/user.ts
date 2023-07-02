import { Exclude } from 'class-transformer';

export class User {
  id: string;
  email: string;
  @Exclude()
  password: string;
}
