import  { Controller, Get, Param, Query, Body, Put, Post, Patch, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res, ParseIntPipe, Session, UseGuards, NotFoundException, InternalServerErrorException, HttpStatus, HttpException, BadRequestException } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserProfile } from "./user.profile";
import { AuthGuard } from "./auth/auth.guard";
import { UserEntity } from "./user.entity";




@Controller('user')
  export class UserController {
    constructor(
      private readonly userService: UserService,
    ) {}

   
    @Post('createprofile/:email')
    @UseGuards(AuthGuard)
      async createProfile(@Param('email') email: string, @Body() userProfile: UserProfile): Promise<any> {
        try {
          return await this.userService.createProfile(email,userProfile);
        } catch (error) {
          throw new BadRequestException('Error occurred while create profile: ' + error.message);
        }
      }


      @Put('updateprofile/:email')
      @UseGuards(AuthGuard)
      async updateProfile(
          @Param('email') email: string, 
          @Body() updatedProfile: UserProfile
      ): Promise<UserProfile> {
          return await this.userService.updateProfile(email, updatedProfile);
      }
      

    @Get('get/:email')
    @UseGuards(AuthGuard)
    async getProfile(
        @Param('email') email: string
    ): Promise<UserProfile> {
        return await this.userService.getProfile(email);
    }
    
    @Get('getuser/:email')
    @UseGuards(AuthGuard)
    async getUser(
        @Param('email') email: string
    ): Promise<string> {
        return await this.userService.getUser(email);
    }









  }









