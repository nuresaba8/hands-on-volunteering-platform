import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLoginDTO } from "./user.logindto";
import { UserProfile } from "./user.profile";
import { EventEntity } from "src/Organizer/event.dto";
import { HelpResponseEntity } from "src/Community/helpResponse.Entity";
import { HelpRequestEntity } from "src/Community/helpRequest.Entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserProfile,UserLoginDTO, EventEntity, HelpResponseEntity,HelpRequestEntity]), 
  ],
  controllers: [UserController],
  providers: [UserService], 
  exports: [UserService],

})
export class UserModule {}