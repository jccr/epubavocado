export const toArray = <T>(valueOrArray: T | T[]): T[] => {
  if (!valueOrArray) {
    return []
  }
  if (Array.isArray(valueOrArray)) {
    return valueOrArray
  }
  return [valueOrArray]
}

export type Maybe<T> = null | undefined | T
