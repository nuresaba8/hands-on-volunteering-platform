import { Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/User/user.entity';
import { HelpResponseEntity } from './helpResponse.Entity';

@Entity('Help_Request')
export class HelpRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.helps)
  @JoinColumn({ name: 'user_email' })
  @Expose() // Expose userEntity to JSON serialization
  userEntity: UserEntity;

  @OneToMany(() => HelpResponseEntity, (response) => response.helpRequest, { cascade: true })
  responses: HelpResponseEntity[] | null;
}
