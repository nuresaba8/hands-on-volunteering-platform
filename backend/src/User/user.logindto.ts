import { IsEmail, IsNotEmpty } from "class-validator";

export class UserLoginDTO
{
  @IsNotEmpty()
  @IsEmail()
    Email: string;

    @IsNotEmpty()
  Password: string;


}