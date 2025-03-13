import { Entity, Column, PrimaryGeneratedColumn, OneToOne ,JoinColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('User_Profile')
export class UserProfile {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  skill: string;

  @Column()
  interest: string;

  @Column()
  volunteer_history: string;

  @OneToOne(() => UserEntity, userEntity => userEntity.userProfile)
  userEntity: UserEntity;
}