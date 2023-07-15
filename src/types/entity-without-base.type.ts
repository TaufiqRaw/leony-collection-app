import { CustomBaseEntity } from "../utils/classes/custom-base.entity";

export type EntityWithoutBase<T> = {
  [K in keyof Omit<T, keyof CustomBaseEntity>] : T[K]
}