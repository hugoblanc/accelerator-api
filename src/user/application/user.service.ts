import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { User } from '../domain/user';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../core/security/auth/auth.service';

@Injectable()
export class UserService {
  saltRounds = 10;

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createUser(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        firstname,
        lastname,
        password: await this.hashPassword(password),
        subscription: {
          create: {},
        },
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
    return this.authService.generateJwt({sub: user.id, email: user.email});
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email: { equals: email },
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    if (id) {
      return this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
    }
    throw new UnauthorizedException('No user authenticated');
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
