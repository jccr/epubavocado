import { Meta, Package } from '../models/package.js'
import { toArray } from '../util.js'
import type { EntityConstructor } from './entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function MetaProperties<TBase extends EntityConstructor>(Base: TBase) {
  return class MetaProperties extends Base {
    _resolveMetaProperty(property: string, constructor = Meta) {
      return toArray(this._resolveMetaPropertyList(property, constructor))[0]
    }

    _resolveMetaPropertyList(property: string, constructor = Meta) {
      const propertyMap = (this._context as Package).metadata()
        ._metaPropertyMap[((this as unknown) as Meta).id()]
      if (!propertyMap) {
        return null
      }

      const metaNodes = propertyMap[property]
      if (!metaNodes) {
        return null
      }

      return metaNodes.map((node: Node) => new constructor(node, this._context))
    }

    alternateScript() {
      return this._resolveMetaPropertyList('alternate-script')
    }

    displaySeq() {
      return this._resolveMetaProperty('display-seq')
    }

    fileAs() {
      return this._resolveMetaProperty('file-as')
    }

    groupPosition() {
      return this._resolveMetaProperty('group-position')
    }

    metaAuth() {
      return this._resolveMetaProperty('meta-auth')
    }
  }
}
