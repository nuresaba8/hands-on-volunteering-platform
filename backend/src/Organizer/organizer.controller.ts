import  { Controller, Get, Param, Query, Body, Put, Post, Patch, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res, ParseIntPipe, Session, UseGuards, NotFoundException, InternalServerErrorException, HttpStatus, HttpException, BadRequestException } from "@nestjs/common";
import { AuthGuard } from "src/User/auth/auth.guard"; 
import { UserEntity } from "src/User/user.entity"; 
import { OrganizerService } from "./organizer.service";
import { EventEntity } from "./event.dto";
import { UserService } from "src/User/user.service"; 






@Controller('organizer')
  export class OrganizerController {
    constructor(
      private readonly organizerService: OrganizerService,
      private readonly userService: UserService,
    ) {}

   
    @Post('createevent/:email')
    @UseGuards(AuthGuard)
      async createEvent(@Param('email') email: string, @Body() eventEntity: EventEntity): Promise<any> {
        try {
          return await this.organizerService.createEvent(email,eventEntity);
        } catch (error) {
          throw new BadRequestException('Error occurred while create event: ' + error.message);
        }
      }


      @Put('updateevent/:eventId')
@UseGuards(AuthGuard)
async updateEvent(@Param('eventId') eventId: number, @Body() eventEntity: EventEntity): Promise<any> {
  try {
    return await this.organizerService.updateEvent(eventId, eventEntity);
  } catch (error) {
    throw new BadRequestException('Error occurred while updating event: ' + error.message);
  }
}


@Delete('deleteevent/:eventId')
@UseGuards(AuthGuard)
async deleteEvent(@Param('eventId') eventId: number): Promise<any> {
  try {
    return await this.organizerService.deleteEvent(eventId);
  } catch (error) {
    throw new BadRequestException('Error occurred while deleting event: ' + error.message);
  }
}


      

      @Get('all')
      @UseGuards(AuthGuard)
      async getAllEvents(): Promise<EventEntity[]> {
        try {
          return await this.organizerService.getAllEvents();
        } catch (error) {
          throw new BadRequestException('Error occurred while fetching events: ' + error.message);
        }
      }

      @Get('search')
      @UseGuards(AuthGuard)
  async searchEvents(@Query('query') query: string) {
    return this.organizerService.searchEvents(query);
  }
  @Get('getjoined/event/:email')
  @UseGuards(AuthGuard) // Ensure the user is authenticated
  async getJoinedEvents(@Param('email') email: string) { // Extract email from URL parameter
    return this.organizerService.getJoinedEvents(email); // Pass email to the service
  }
  

  @Post('join/:eventId')
@UseGuards(AuthGuard)
async joinEvent(
  @Param('eventId') eventId: number,
  @Body() body: { email: string },
) {
  try {
    const user = await this.userService.findOne(body.email); // Retrieve the user
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const event = await this.organizerService.findEventById(eventId); // Retrieve the event
    if (!event) {
      throw new BadRequestException('Event not found');
    }
    await this.organizerService.addUserToEvent(event, user);

    return { message: 'Successfully joined the event!' };
  } catch (error) {
    throw new BadRequestException('Error joining event: ' + error.message);
  }
}





  }








