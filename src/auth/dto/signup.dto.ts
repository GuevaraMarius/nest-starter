import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class SignupDto {
  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('RW')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
