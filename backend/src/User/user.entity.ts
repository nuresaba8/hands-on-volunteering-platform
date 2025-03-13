import { Expose, Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { UserProfile } from './user.profile';
import { EventEntity } from 'src/Organizer/event.dto';
import { HelpRequestEntity } from 'src/Community/helpRequest.Entity';
import { HelpResponseEntity } from 'src/Community/helpResponse.Entity';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  @IsNotEmpty()
  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @Column()
  Password: string;

  @Column()
  roll: string;

  @OneToOne(() => UserProfile, userProfile => userProfile.userEntity, { cascade: true })
  @JoinColumn()
  userProfile: UserProfile | null;

  @OneToOne(() => EventEntity, event => event.userEntity, { cascade: true, onDelete: 'SET NULL' })
@JoinColumn()
event: EventEntity | null;


  @ManyToMany(() => EventEntity, (event) => event.attendees, { cascade: true })
  @Expose()
  events: EventEntity[];

  @OneToMany(() => HelpRequestEntity, help => help.userEntity, { cascade: true })
  @Exclude() // Exclude from serialization
  helps: HelpRequestEntity[] | null;

  @OneToMany(() => HelpResponseEntity, response => response.userEntity, { cascade: true })
  @Exclude() // Exclude from serialization
  responses: HelpResponseEntity[] | null;
}