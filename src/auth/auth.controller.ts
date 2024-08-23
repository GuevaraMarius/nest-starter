import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/shared/response-dto';
import { loginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: loginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (user) {
      return this.authService.login(user);
    }
    return new ResponseDto(400, 'error', 'Invalid credentials');
  }

  @Post('register')
  async register(@Body() registerDto: SignupDto) {
    try {
      const user = await this.authService.register(registerDto);
      return new ResponseDto(
        201,
        'success',
        'User registered successfully',
        user,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        return new ResponseDto(409, 'error', error.message);
      }
      throw error;
    }
  }
}
