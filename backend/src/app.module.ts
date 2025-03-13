import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './User/auth/auth.module'; 
import { OrganizerModule } from './Organizer/organizer.module';
import { CommunityModule } from './Community/help.module';


@Module({
  imports: [
    UserModule,
    OrganizerModule,
    CommunityModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'saba',
      database: 'HandsOn_Volunteering_Platform',
      autoLoadEntities: true,
      synchronize: true,
    }), AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}