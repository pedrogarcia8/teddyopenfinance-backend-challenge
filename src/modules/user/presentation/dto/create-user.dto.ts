import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'test@email.com',
    description: 'User email',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: '123456',
    description: 'User password',
    required: true,
  })
  password: string;
}
