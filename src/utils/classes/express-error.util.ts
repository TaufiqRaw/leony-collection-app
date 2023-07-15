export class ExpressError extends Error {
  status : number;
  data ?: null | object;
  constructor(message : string, status : number = 500){
    super(message);
    this.status = status;
  }
}