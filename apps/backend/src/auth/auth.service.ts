import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          return user;
        }
      }
    } catch (error) {
      console.error('Error validating user:', error);
    }
    return null;
  }

  async registerUser(username: string, password: string): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
    }
  }
}
