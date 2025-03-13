import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEntity } from "./event.dto";
import { OrganizerController } from "./organizer.controller";
import { OrganizerService } from "./organizer.service";
import { UserEntity } from "src/User/user.entity"; 
import { UserModule } from "src/User/user.module";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([EventEntity,UserEntity]), 
  ],
  controllers: [OrganizerController],
  providers: [OrganizerService], 
  exports: [OrganizerService],

})
export class OrganizerModule {}