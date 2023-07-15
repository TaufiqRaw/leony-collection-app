import { ExpressError } from "./express-error.util";

export class ValidatorError extends ExpressError{
  errors : any[];
  constructor(errors : any[]){
    super("Validation error", 400);
    this.errors = errors;
  }
}