import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './login.dto';
import { RegisterDTO } from './register.dto';
import type { FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDTO: loginDTO,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const tokens = await this.authService.login(loginDTO);
    if (!tokens) {
      throw new Error('Couldnt generate token');
    }

    response.setCookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60,
    });

    response.setCookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 15 * 60,
    });
  }

  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.registerUser(
      registerDTO.username,
      registerDTO.password,
    );
  }
}
