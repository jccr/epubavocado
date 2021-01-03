import { Entity } from '../mixins/entity.js'
import { ID } from './mixins/id.js'
import { Maybe, toArray } from '../../util.js'
import { ManifestItem } from './manifest-item.js'
import { SpineItem } from './spine-item.js'
import {
  allPropertiesFilter,
  anyPropertiesFilter,
  idFilter,
  resolveIdref,
} from './util.js'

export class Spine extends ID(Entity) {
  pageProgressionDirection(): Maybe<string> {
    return this._resolve('./@page-progression-direction')
  }

  toc(): Maybe<ManifestItem> {
    const idref = this._resolve('./@toc')
    return resolveIdref(this, idref)
  }

  itemref({
    id,
    anyProperties,
    allProperties,
    onlyProperties,
    linear,
  }: {
    id?: string
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
    linear?: boolean
  } = {}): Maybe<SpineItem> {
    return this.itemrefs({
      ids: id ? [id] : [],
      anyProperties,
      allProperties,
      onlyProperties,
      linear,
    })[0]
  }

  itemrefs({
    ids,
    anyProperties,
    allProperties,
    onlyProperties,
    linear,
  }: {
    ids?: string[]
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
    linear?: boolean
  } = {}): SpineItem[] {
    if (linear !== undefined) {
      return this.itemrefs({
        ids,
        anyProperties,
        allProperties,
        onlyProperties,
      })?.filter((item) => item.linear() === linear)
    }

    if (onlyProperties) {
      return this.itemrefs({
        ids,
        anyProperties,
        allProperties: onlyProperties,
      })?.filter(
        (item) => toArray(item.properties()).length === onlyProperties.length,
      )
    }

    const expression = `./opf:itemref${idFilter(ids)}${anyPropertiesFilter(
      anyProperties,
    )}${allPropertiesFilter(allProperties)}`

    return this._resolveAll(expression, SpineItem)
  }
}
