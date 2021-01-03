import type { Entity } from '../mixins/entity.js'
import type { Package } from '../package.js'
import { Maybe, toArray } from '../../util.js'
import type { ManifestItem } from './manifest-item.js'

export const resolveIdref = (
  entity: Entity,
  idref: Maybe<string>,
): Maybe<ManifestItem> => {
  if (!idref) {
    return null
  }
  return (entity._context as Package).manifest()?.item({ id: idref })
}

export const attributeFilter = (
  attribute: string,
  values?: string | string[],
  operator = 'or',
): string =>
  values && values.length
    ? `[${toArray(values)
        .map((value) => `${attribute}='${value}'`)
        .join(` ${operator} `)}]`
    : ''

export const attributeContainsWordFilter = (
  attribute: string,
  words?: string | string[],
  operator = 'or',
): string =>
  words && words.length
    ? `[${toArray(words)
        .map(
          (value) =>
            `contains(concat(' ', normalize-space(${attribute}), ' '), ' ${value} ')`,
        )
        .join(` ${operator} `)}]`
    : ''

export const idFilter = (id?: string | string[]): string =>
  attributeFilter('@id', id)

export const anyPropertiesFilter = (anyProperties?: string[]): string =>
  attributeContainsWordFilter('@properties', anyProperties, 'or')
export const allPropertiesFilter = (allProperties?: string[]): string =>
  attributeContainsWordFilter('@properties', allProperties, 'and')

export const anyRelFilter = (anyProperties?: string[]): string =>
  attributeContainsWordFilter('@rel', anyProperties, 'or')
export const allRelFilter = (allProperties?: string[]): string =>
  attributeContainsWordFilter('@rel', allProperties, 'and')
