import {
  ValidationPipe,
  UsePipes,
  BadRequestException,
  Body,
  Controller,
  Patch,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Patch('update')
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  )
  async updateOrder(@Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(updateOrderDto.items);
  }
}
