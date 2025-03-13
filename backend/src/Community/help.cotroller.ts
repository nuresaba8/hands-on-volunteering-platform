import { Controller, Post, Get, Body, Param, UseGuards, BadRequestException, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { HelpRequestService } from './help.service'; 
import { HelpRequestEntity } from './helpRequest.Entity';
import { HelpResponseEntity } from './helpResponse.Entity';
import { AuthGuard } from 'src/User/auth/auth.guard';

@Controller('help')
@UseInterceptors(ClassSerializerInterceptor) 
export class HelpRequestController {
  constructor(private readonly helpRequestService: HelpRequestService) {}

 
  @Post('requesthelp/:email')
  @UseGuards(AuthGuard)
  async createHelpRequest(@Param('email') email: string, @Body() help: HelpRequestEntity) {
    try {
      return this.helpRequestService.createHelpRequest(email, help);
    } catch (error) {
      throw new BadRequestException('Error occurred while creating help request: ' + error.message);
    }
  }

  @Get('requesthelp')
@UseGuards(AuthGuard)
async getAllHelpRequests() {
  try {
    return await this.helpRequestService.getAllHelpRequests();
  } catch (error) {
    throw new BadRequestException('Error occurred while fetching help requests: ' + error.message);
  }
}


@Get('userrequests/:email')
@UseGuards(AuthGuard) // Ensures user is authenticated
async getUserRequests(@Param('email') email: string) {

    // Pass email to service to fetch help requests and their responses
    const requests = await this.helpRequestService.getHelpRequestsByUser(email);

    return requests;
  } 



  @Post('respond/:email/:requestId')
async respondToHelpRequest(
  @Param('email') email: string,
  @Param('requestId') requestId: number,
  @Body() response: HelpResponseEntity, // Directly use the body as the response
) {
  return this.helpRequestService.respondToHelpRequest(email, requestId, response);
}
}

