import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EditUserDto {
  @IsOptional()
  @IsString()
  name : string;

  @IsOptional()
  @IsString()
  password : string;
} 