import  { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, MoreThan, ILike, Not } from 'typeorm';
import { EventEntity } from "./event.dto";
import { UserEntity } from "src/User/user.entity";




@Injectable()
export class OrganizerService {
  constructor(@InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>,
  @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,

) {}

  

async createEvent(email: string, eventEntity: EventEntity): Promise<EventEntity> {
  const user= await this.userRepository.findOne({ where: { Email: email } });
  if (!user) {
    throw new BadRequestException('User not found');
  }
  eventEntity.date=new Date();
  const event= await this.eventRepository.save(eventEntity);
  user.event = event;
  await this.userRepository.save(user);
  return event;  
}


async updateEvent(eventId: number, eventEntity: EventEntity): Promise<EventEntity> {
  const event = await this.eventRepository.findOne({ where: { Id: eventId } });
  if (!event) {
    throw new BadRequestException('Event not found');
  }
  
  // You can update the event with the new details
  event.title = eventEntity.title;
  event.date = eventEntity.date;
  event.location = eventEntity.location;
  event.description=eventEntity.description
  // Add other fields you need to update

  const updatedEvent = await this.eventRepository.save(event);
  return updatedEvent;
}

async deleteEvent(eventId: number): Promise<any> {
  // Find the event with its related entities
  const event = await this.eventRepository.findOne({
    where: { Id: eventId },
    relations: ['userEntity', 'attendees'], // Ensure relations are loaded
  });
  
  if (!event) {
    throw new BadRequestException('Event not found');
  }

  // Remove the event from the userEntity (creator of the event)
  if (event.userEntity) {
    event.userEntity.event = null; // Detach the event from the user
    await this.userRepository.save(event.userEntity); // Save the updated user
  }

  // Remove the event from all attendees
  for (const attendee of event.attendees || []) {
    attendee.events = attendee.events?.filter(e => e.Id !== eventId);
    await this.userRepository.save(attendee); // Save each updated attendee
  }

  // Now delete the event from the database
  await this.eventRepository.remove(event);

  const final = await this.eventRepository.find({
    where: { Id: Not(eventId) }});
  return final;
}


async getAllEvents(): Promise<EventEntity[]> {
    return this.eventRepository.find();
  }



  async searchEvents(query: string) {
    if (!query) {
      return this.eventRepository.find(); // Return all events if no query
    }

    return this.eventRepository.find({
      where: [
        { title: ILike(`%${query}%`) }, 
      { location: ILike(`%${query}%`) }, 
      { description: ILike(`%${query}%`) },
      ],
    });
  }

  async getJoinedEvents(email: string) {
    const user = await this.userRepository.findOne({
      where: { Email: email },
      relations: ['events'], // This will fetch the 'events' that the user is attending
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    return user.events; // Return the list of events the user has joined
  }
  

  async findEventById(eventId: number): Promise<EventEntity> {
    return this.eventRepository.findOneBy({ Id: eventId });
  }


  async addUserToEvent(event: EventEntity, user: UserEntity) {
    const existingEvent = await this.eventRepository.findOne({
        where: { Id: event.Id },
        relations: ['attendees'], 
    });

    if (!existingEvent) {
        throw new Error('Event not found');
    }
    if (existingEvent.attendees.some(attendee => attendee.Email === user.Email)) {
        throw new Error('User is already attending the event');
    }
    const existingUser = await this.userRepository.findOne({
        where: { Email: user.Email },
        relations: ['events'],
    });

    if (!existingUser) {
        throw new Error('User not found');
    }
    existingEvent.attendees.push(existingUser);
    existingUser.events.push(existingEvent);
    await this.eventRepository.save(existingEvent);
    await this.userRepository.save(existingUser);

    return existingEvent; 
}



}

