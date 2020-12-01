import { nodeTypeMap } from '../models/package.js'
import { prefixMap } from '../xpath.js'
import type { EntityConstructor } from './entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Refines<TBase extends EntityConstructor>(Base: TBase) {
  return class Refines extends Base {
    refines() {
      const refines = this._resolve('./@refines') as string
      if (!refines) {
        return null
      }

      // drop the # prefix
      const idRefined = refines[0] === '#' ? refines.substr(1) : refines
      const node = this._context._select(`//*[@id='${idRefined}']`) as Attr
      if (!node) {
        return null
      }

      const name = node.localName
      const namespace = node.namespaceURI
      if (!namespace) {
        return null
      }

      const prefix = prefixMap[namespace]
      const typeConstructor = nodeTypeMap()[`${prefix}:${name}`]
      if (!typeConstructor) {
        return null
      }

      return new typeConstructor(node, this._context)
    }
  }
}
