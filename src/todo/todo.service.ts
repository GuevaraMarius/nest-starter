import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    isDone?: boolean,
  ): Promise<Todo[]> {
    const query = this.todoRepository.createQueryBuilder('todo');

    if (isDone !== undefined) {
      query.andWhere('todo.isDone = :isDone', { isDone });
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async findUserTodos(
    userId: number,
    page?: number,
    limit?: number,
    isDone?: boolean,
  ): Promise<Todo[]> {
    const query = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.user.id = :userId', { userId });

    if (isDone !== undefined) {
      query.andWhere('todo.isDone = :isDone', { isDone });
    }

    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async create(todo: Partial<Todo>, userId: number): Promise<Todo> {
    const existingTodo = await this.todoRepository.findOne({
      where: { title: todo.title },
    });
    if (existingTodo) {
      throw new ConflictException(
        `Todo with title '${todo.title}' already exists`,
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newTodo = this.todoRepository.create({
      ...todo,
      user,
    });

    try {
      return await this.todoRepository.save(newTodo);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create todo');
    }
  }

  async update(id: number, todo: Partial<Todo>, userId: number): Promise<Todo> {
    const existingTodo = await this.findOne(id);

    // Ensure the user owns the todo
    if (existingTodo.user.id !== userId) {
      throw new ConflictException('You can only update your own todos');
    }

    Object.assign(existingTodo, todo);

    try {
      return await this.todoRepository.save(existingTodo);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update todo');
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    const existingTodo = await this.findOne(id);

    // Ensure the user owns the todo
    if (existingTodo.user.id !== userId) {
      throw new ConflictException('You can only delete your own todos');
    }

    try {
      await this.todoRepository.remove(existingTodo);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete todo');
    }
  }
}
