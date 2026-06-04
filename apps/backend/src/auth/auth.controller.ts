import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './login.dto';
import { RegisterDTO } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDTO: loginDTO) {
    return this.authService.validateUser(loginDTO.username, loginDTO.password);
  }

  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.registerUser(
      registerDTO.username,
      registerDTO.password,
    );
  }
}
