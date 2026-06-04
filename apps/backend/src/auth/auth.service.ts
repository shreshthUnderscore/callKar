import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { loginDTO } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getTokens(userId: string, username: string) {
    const payload = { username, sub: userId };
    const accessJWTSecret = process.env.JWT_ACCESS_SECRET;
    const refreshJWTSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessJWTSecret) {
      throw new Error('JWT_ACCESS_SECRET is not set');
    }
    if (!refreshJWTSecret) {
      throw new Error('JWT_REFRESH_SECRET is not set');
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessJWTSecret,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshJWTSecret,
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginDTO: loginDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: loginDTO.username },
      });
      if (user) {
        const isPasswordValid = await bcrypt.compare(
          loginDTO.password,
          user.password,
        );
        if (isPasswordValid) {
          return await this.getTokens(user.id, user.username);
        }
      }
    } catch (error) {
      console.error('Error validating user:', error);
    }
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
