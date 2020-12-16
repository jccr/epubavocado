export const toArray = <T>(valueOrArray: T | T[]): T[] => {
  if (!valueOrArray) {
    return []
  }
  if (Array.isArray(valueOrArray)) {
    return valueOrArray
  }
  return [valueOrArray]
}

export const splitRelAttribute = (rel: string): string[] =>
  // normalize spaces and split space separated words
  rel.replace(/\s+/g, ' ').split(' ')

export type Maybe<T> = null | undefined | T
