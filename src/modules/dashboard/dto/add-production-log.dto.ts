import { IsNotEmpty, IsNumberString } from "class-validator";

export class AddProductionLogDto {
  @IsNotEmpty()
  @IsNumberString()
  amount : number;

  @IsNotEmpty()
  @IsNumberString()
  type : number;
}