import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from 'src/todo/todo.entity';
import { Repository } from 'typeorm';
import { OrderItemDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Todo)
    private readonly taskRepository: Repository<Todo>,
  ) {}

  async updateOrder(items: OrderItemDto[]) {
    const updatePromises = items.map((item) =>
      this.taskRepository.update(item.id, { position: item.position }),
    );

    await Promise.all(updatePromises);
    return { success: true };
  }
}
