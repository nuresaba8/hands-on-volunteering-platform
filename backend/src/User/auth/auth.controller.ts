import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from '../user.logindto';
import { UserEntity } from '../user.entity';
import * as bcrypt from "bcrypt";
import { UserProfile } from '../user.profile';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}



  @Post('adduser')
  async signUp(@Body() userEntity: UserEntity): Promise<any> {
    try {
      return await this.authService.signUp(userEntity);
    } catch (error) {
      throw new BadRequestException('Error occurred while signing up: ' + error.message);
    }
  }
 


@Post('login')
  signIn(@Body() signInDto: UserLoginDTO) {
    return this.authService.signIn(signInDto);
  }

}