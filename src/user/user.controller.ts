import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/todo/filters/all-exceptions.filter';
import { RolesGuard } from 'src/auth/guard/roles.guard';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}
}
