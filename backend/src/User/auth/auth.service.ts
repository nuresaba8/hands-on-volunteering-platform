import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service'; 
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { UserLoginDTO } from '../user.logindto';
import { UserEntity } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}


  async signUp(userEntity: UserEntity): Promise<any> {
    try {
      await this.userService.createAuthJudge(userEntity);
      return { message: "User is added successfully" };
    } catch (error) {
      throw new BadRequestException('Failed to sign up judge: ' + error.message);
    }
  }
  
  


  async signIn(signInDto: UserLoginDTO): Promise<{ access_token: string; email: string }> {
    try {
      const user = await this.userService.findOne(signInDto.Email);
      
      if (!user || !(await bcrypt.compare(signInDto.Password, user.Password))) {
        throw new UnauthorizedException('Invalid email or password');
      }
      const payload = { email: signInDto.Email, password: signInDto.Password };  
      
      return {
        access_token: await this.jwtService.signAsync(payload),
        email: user.Email,
      };
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  }
}