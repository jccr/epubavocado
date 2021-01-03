import type { EntityConstructor } from '../../mixins/entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Properties<TBase extends EntityConstructor>(Base: TBase) {
  return class Properties extends Base {
    properties() {
      const properties = this._resolve('./@properties') as string
      if (properties) {
        // normalize spaces and split space separated words
        return properties.replace(/\s+/g, ' ').split(' ')
      }
    }
  }
}
