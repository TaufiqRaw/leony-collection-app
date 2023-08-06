import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateProductionTypeDto {
  @IsOptional()
  @IsString()
  name ?: string;

  @IsOptional()
  @IsNumberString()
  salary ?: number;
}