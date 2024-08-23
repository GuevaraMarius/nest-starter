import {
  Controller,
  Post,
  Body,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      await this.authService.register(registerDto);
      return new ResponseDto(201, 'success', 'User registered successfully');
    } catch (error) {
      if (error instanceof ConflictException) {
        return new ResponseDto(409, 'error', error.message);
      }
      throw error;
    }
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.authService.forgotPassword(email);
      return new ResponseDto(200, 'success', 'Password reset link sent');
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ResponseDto(404, 'error', error.message);
      }
      throw error;
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.authService.resetPassword(token, newPassword);
      return new ResponseDto(200, 'success', 'Password reset successfully');
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        return new ResponseDto(400, 'error', error.message);
      }
      throw error;
    }
  }

  @Post('logout')
  async logout() {
    try {
      await this.authService.logout();
      return new ResponseDto(200, 'success', 'Logged out successfully');
    } catch (error) {
      return new ResponseDto(500, 'error', 'Logout failed');
    }
  }
}
