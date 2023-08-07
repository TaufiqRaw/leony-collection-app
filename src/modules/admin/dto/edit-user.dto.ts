import { IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";

export class EditUserDto {
  @IsOptional()
  @IsString()
  name : string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password : string;
} 