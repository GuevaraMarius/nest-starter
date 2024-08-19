import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'doroll',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TodoModule,
  ],
})
export class AppModule {}
