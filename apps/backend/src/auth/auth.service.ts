import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string } | null> {
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
}
