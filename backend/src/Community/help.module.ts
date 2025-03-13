import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEntity } from "src/Organizer/event.dto"; 
import { HelpRequestController } from "./help.cotroller";
import { HelpRequestService } from "./help.service";
import { UserEntity } from "src/User/user.entity"; 
import { HelpRequestEntity } from "./helpRequest.Entity";
import { HelpResponseEntity } from "./helpResponse.Entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity,UserEntity,HelpRequestEntity,HelpResponseEntity]), 
  ],
  controllers: [HelpRequestController],
  providers: [HelpRequestService], 
  exports: [HelpRequestService],

})
export class CommunityModule {}