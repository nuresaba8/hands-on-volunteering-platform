import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/User/user.entity';
import { HelpRequestEntity } from './helpRequest.Entity';

@Entity('Help_Response')
export class HelpResponseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @ManyToOne(() => UserEntity, (user) => user.responses)
  @JoinColumn({ name: 'user_email' })
  userEntity: UserEntity;

  @ManyToOne(() => HelpRequestEntity, (helpRequest) => helpRequest.responses)
  @JoinColumn()
  helpRequest: HelpRequestEntity;
}