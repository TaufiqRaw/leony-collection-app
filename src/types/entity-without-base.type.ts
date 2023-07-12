import { CustomBaseEntity } from "../utils/custom-base.entity";

export type EntityWithoutBase<T> = {
  [K in keyof Omit<T, keyof CustomBaseEntity>] : T[K]
}