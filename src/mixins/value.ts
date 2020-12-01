import type { EntityConstructor } from './entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Value<TBase extends EntityConstructor>(Base: TBase) {
  return class Value extends Base {
    value() {
      const textNode = this._select('./text()') as Node
      if (textNode) {
        return textNode.nodeValue
      }
    }
  }
}
