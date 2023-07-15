import { User } from "@/modules/user/user.entity";

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}