import { UserEntity } from 'src/User/user.entity'; 
import { Entity, Column, PrimaryGeneratedColumn, OneToOne ,JoinColumn, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('Event')
export class EventEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  location: string;

  @Column()
  description: string;

  @OneToOne(() => UserEntity, userEntity => userEntity.event)
  userEntity: UserEntity;

  @ManyToMany(() => UserEntity, userEntity => userEntity.events)
  @JoinTable() // Create a join table for many-to-many relationship
  attendees: UserEntity[] | null;
}