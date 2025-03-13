import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpResponseEntity } from './helpResponse.Entity'; 
import { UserEntity } from 'src/User/user.entity'; 
import { HelpRequestEntity } from './helpRequest.Entity';

@Injectable()
export class HelpRequestService {
  constructor(
    @InjectRepository(HelpResponseEntity)
    private helpResponseRepository: Repository<HelpResponseEntity>,
    @InjectRepository(HelpRequestEntity)
    private helpRequestRepository: Repository<HelpRequestEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createHelpRequest(email: string, helpData: HelpRequestEntity) {
    if (!helpData) {
        throw new Error('Help request data is required');
    }

    const user = await this.userRepository.findOne({
        where: { Email: email },
        relations: ['helps'],
    });
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.helps) {
        user.helps = [];
    }
    helpData.userEntity = user;

    if (!helpData.userEntity) {
        throw new Error('Help request must be associated with a user');
    }
    const savedHelpRequest = await this.helpRequestRepository.save(helpData);
    user.helps.push(savedHelpRequest);

    // Save the updated user
    await this.userRepository.save(user);

    return savedHelpRequest;
}

async getAllHelpRequests(): Promise<HelpRequestEntity[]> {
  try {
    return await this.helpRequestRepository.find({
      relations: ['userEntity'], // Fetch user details along with the request
    });
  } catch (error) {
    throw new Error('Failed to fetch help requests: ' + error.message);
  }
}


async getHelpRequestsByUser(email: string): Promise<any[]> {
  try {
    // Fetch help requests for the user along with the associated responses
    const requests = await this.helpRequestRepository.find({
      where: { userEntity: { Email:email } }, // Filter by user email
      relations: ['userEntity', 'responses'], // Fetch user details and related responses
    });

    // Map over the help requests and return the request details with its responses
    return requests.map((request) => ({
      id: request.id,
      title: request.title,
      description: request.description,
      userEntity: request.userEntity, // The user who created the request
      responses: request.responses, // Responses to the request
      responded: request.responses && request.responses.length > 0, // Check if there are any responses
    }));
  } catch (error) {
    throw new Error('Failed to fetch help requests: ' + error.message);
  }
}



async respondToHelpRequest(email: string, requestId: number, response: HelpResponseEntity) {
  if (!response) {
    throw new Error('Response data is required');
  }

  const user = await this.userRepository.findOne({
    where: { Email: email },
    relations: ['helps', 'responses'],
  });

  if (!user) throw new Error('User not found');

  const helpRequest = await this.helpRequestRepository.findOne({ where: { id: requestId } });
  if (!helpRequest) throw new Error('Help request not found');

  // Assign the user and help request to the response
  response.userEntity = user;
  response.helpRequest = helpRequest;

  // Save the response
  const savedResponse = await this.helpResponseRepository.save(response);

  // Initialize the responses array if it doesn't exist
  if (!user.responses) {
    user.responses = [];
  }

  // Add the saved response to the user's responses
  user.responses.push(savedResponse);
  await this.userRepository.save(user);

  return savedResponse;
}


}
