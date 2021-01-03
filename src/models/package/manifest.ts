import { Entity } from '../mixins/entity.js'
import { ID } from './mixins/id.js'
import { Maybe, toArray } from '../../util.js'
import { ManifestItem } from './manifest-item.js'
import {
  idFilter,
  attributeFilter,
  anyPropertiesFilter,
  allPropertiesFilter,
} from './util.js'

export class Manifest extends ID(Entity) {
  item({
    id,
    href,
    anyProperties,
    allProperties,
    onlyProperties,
  }: {
    id?: string
    href?: string
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
  } = {}): Maybe<ManifestItem> {
    return this.items({
      ids: id ? [id] : [],
      href,
      anyProperties,
      allProperties,
      onlyProperties,
    })[0]
  }

  items({
    ids,
    href,
    anyProperties,
    allProperties,
    onlyProperties,
  }: {
    ids?: string[]
    href?: string
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
  } = {}): ManifestItem[] {
    if (onlyProperties) {
      return this.items({
        ids: ids,
        anyProperties,
        allProperties: onlyProperties,
      })?.filter(
        (item) => toArray(item.properties()).length === onlyProperties.length,
      )
    }

    const expression = `./opf:item${idFilter(ids)}${attributeFilter(
      '@href',
      href,
    )}${anyPropertiesFilter(anyProperties)}${allPropertiesFilter(
      allProperties,
    )}`

    return this._resolveAll(expression, ManifestItem)
  }
}
