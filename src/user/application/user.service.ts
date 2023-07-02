import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../../core/prisma/prisma.service';
import {User} from '../domain/user';
import * as bcrypt from 'bcrypt';
import {AuthService} from "../../core/security/auth/auth.service";

@Injectable()
export class UserService {
  saltRounds = 10;

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        password: await this.hashPassword(password),
      },
    });

    return user;
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await this.comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Token generation
    return this.authService.generateToken(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {equals: email},
      },
    });
    return user;
  }

  hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };
}
