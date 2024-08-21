import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  UseFilters,
  ValidationPipe,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todos-dto';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { Todo } from './todo.entity';
import { ResponseDto } from 'src/shared/response-dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ERole } from 'src/user/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
@UseFilters(AllExceptionsFilter)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @Roles(ERole.ADMIN)
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isDone') isDone?: boolean,
  ): Promise<ResponseDto<Todo[]>> {
    const todos = await this.todoService.findAll(page, limit, isDone);
    return new ResponseDto(
      200,
      'success',
      'Todos retrieved successfully',
      todos,
    );
  }

  @Get('my')
  @Roles(ERole.USER)
  async findMyTodos(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isDone') isDone?: boolean,
  ): Promise<ResponseDto<Todo[]>> {
    const userId = req.user.userId;
    const todos = await this.todoService.findUserTodos(
      userId,
      page,
      limit,
      isDone,
    );
    return new ResponseDto(
      200,
      'success',
      'Your todos retrieved successfully',
      todos,
    );
  }

  @Get(':id')
  @Roles(ERole.USER, ERole.ADMIN)
  async findOne(
    @Req() req: any,
    @Param('id') id: number,
  ): Promise<ResponseDto<Todo>> {
    const todo = await this.todoService.findOne(id);
    const userId = req.user.userId;

    if (!todo) {
      return new ResponseDto(404, 'error', `Todo with ID ${id} not found`);
    }

    if (req.user.role === ERole.USER && todo.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to view this todo');
    }

    return new ResponseDto(
      200,
      'success',
      `Todo with ID ${id} retrieved successfully`,
      todo,
    );
  }

  @Post()
  @Roles(ERole.USER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Req() req: any,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<ResponseDto<Todo>> {
    const userId = req.user.userId;
    const newTodo = await this.todoService.create(createTodoDto, userId);
    return new ResponseDto(
      201,
      'success',
      'Todo created successfully',
      newTodo,
    );
  }

  @Put(':id')
  @Roles(ERole.USER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<ResponseDto<Todo>> {
    const userId = req.user.userId;
    const updatedTodo = await this.todoService.update(
      id,
      updateTodoDto,
      userId,
    );
    return new ResponseDto(
      200,
      'success',
      `Todo with ID ${id} updated successfully`,
      updatedTodo,
    );
  }

  @Delete(':id')
  @Roles(ERole.USER)
  async remove(
    @Req() req: any,
    @Param('id') id: number,
  ): Promise<ResponseDto<void>> {
    const userId = req.user.userId;
    await this.todoService.remove(id, userId);
    return new ResponseDto(
      200,
      'success',
      `Todo with ID ${id} deleted successfully`,
    );
  }
}
