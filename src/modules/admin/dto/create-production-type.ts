import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreateProductionTypeDto {
  @IsNotEmpty()
  @IsString()
  name : string;

  @IsNotEmpty()
  @IsNumberString()
  salary : number;
}