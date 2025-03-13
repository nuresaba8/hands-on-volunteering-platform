import  { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, MoreThan } from 'typeorm';
import { UserEntity } from "./user.entity";
import { UserLoginDTO } from "./user.logindto";
import { UserProfile } from "./user.profile";
import * as bcrypt from 'bcrypt';




@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  @InjectRepository(UserProfile) private userProfileRepository: Repository<UserProfile>,

) {}


 async createAuthJudge(userEntity: UserEntity): Promise<any> {
  userEntity.roll="2";
    const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userEntity.Password, salt);
      userEntity.Password = hashedPassword;
    return await this.userRepository.save(userEntity);

}


async findOne(email: string): Promise<UserEntity> {
  return this.userRepository.findOneBy({ Email: email });
}

async createProfile(email: string, userProfile: UserProfile): Promise<UserProfile> {
  const userEntity = await this.userRepository.findOne({ where: { Email: email }, relations: ['userProfile'] });
  if (!userEntity) {
    throw new BadRequestException('User not found');
  }

  // Check if a profile already exists
  let profile = await this.userProfileRepository.findOne({ where: { userEntity: userEntity } });

  // If profile doesn't exist, create a new one
  if (!profile) {
    profile = new UserProfile();
  }

  // Update profile fields
  profile.name = userProfile.name;
  profile.gender = userProfile.gender;
  profile.skill = userProfile.skill;
  profile.interest = userProfile.interest;
  profile.volunteer_history = userProfile.volunteer_history;

  // Save profile
  await this.userProfileRepository.save(profile);

  // Link profile to the user entity
  userEntity.userProfile = profile;

  // Save user entity
  await this.userRepository.save(userEntity);

  return profile;  
}


async updateProfile(email: string, updatedProfile: UserProfile): Promise<UserProfile> {
  // Fetch the user along with their profile
  const user = await this.userRepository.findOne({ where: { Email: email }, relations: ['userProfile'] });
  
  if (!user || !user.userProfile) {
    throw new BadRequestException('User profile not found');
  }

  // Update the existing user profile
  const userProfile = user.userProfile;
  userProfile.name = updatedProfile.name;
  userProfile.gender = updatedProfile.gender;
  userProfile.skill = updatedProfile.skill;
  userProfile.interest = updatedProfile.interest;
  userProfile.volunteer_history = updatedProfile.volunteer_history;

  // Save the updated profile
  await this.userProfileRepository.save(userProfile);

  return userProfile;  
}


async getProfile(email: string): Promise<UserProfile> {
  const user = await this.userRepository.findOne({
    where: { Email: email },
    relations: ['userProfile'], // This will fetch the associated userProfile
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.userProfile; // Return the user profile
}

async getUser(email: string): Promise<string> {
  const user = await this.userRepository.findOne({
    where: { Email: email },
    relations: ['userProfile'], // This will fetch the associated userProfile
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.roll; // Return the user profile
}


}

